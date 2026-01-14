import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { neon as neonHttp } from '@neondatabase/serverless';
import { AuthSession } from '../types';

// --- Configuration ---

// Database Connection String
const CONNECTION_STRING = 'postgresql://neondb_owner:npg_szgWOViy64lb@ep-solitary-brook-agcnrr7e-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Cloudflare R2 Credentials
const R2_ACCOUNT_ID = '9e93a432dc2055ead397c92cd179c92b';
const R2_ACCESS_KEY_ID = 'c53309e77f4037ef0b762bca003dcd00';
const R2_SECRET_ACCESS_KEY = 'ae1f4ec335ca29aae1ca451cce30ffbf494afbce17f52d1782ff42cbd758651b';
const R2_BUCKET_NAME = 'reyadatime-facilities-images';
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_PUBLIC_URL = 'https://pub-5a1d1074e9bc42669c848765384ca871.r2.dev';

// Initialize S3 Client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Initialize Neon HTTP Client
const sql = neonHttp(CONNECTION_STRING);

// --- Helpers ---

// UUID Generator Polyfill
function uuidv4() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments where randomUUID is not available
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Simple translation helper for the shim
const getShimTranslation = (key: string, defaultText: string) => {
  if (typeof window === 'undefined') return defaultText;
  const lang = localStorage.getItem('language') || 'en';

  const messages: Record<string, Record<string, string>> = {
    'invalid_credentials': {
      en: 'Invalid email or password',
      ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    },
    'user_exists': {
      en: 'This email is already registered',
      ar: 'هذا البريد الإلكتروني مسجل بالفعل'
    },
    'no_session': {
      en: 'No active session found',
      ar: 'لم يتم العثور على جلسة نشطة'
    },
    'mock_oauth': {
      en: 'Social login is mocked in this demo environment.',
      ar: 'تسجيل الدخول الاجتماعي محاكى في هذه البيئة التجريبية.'
    }
  };

  return messages[key]?.[lang] || defaultText;
};

// --- Neon DB Client ---

class QueryBuilder {
  table: string;
  queryType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  columns: string;
  filters: { column: string; operator: string; value: any }[];
  sorts: { column: string; order: 'ASC' | 'DESC' }[];
  limitVal: number | null;
  data: any | null;
  isSingle: boolean;
  isMaybeSingle: boolean;
  options: { count?: string, head?: boolean } | undefined;

  constructor(table: string) {
    this.table = table;
    this.queryType = 'SELECT';
    this.columns = '*';
    this.filters = [];
    this.sorts = [];
    this.limitVal = null;
    this.data = null;
    this.isSingle = false;
    this.isMaybeSingle = false;
    this.options = undefined;
  }

  select(columns = '*', options?: { count?: string, head?: boolean }) {
    // If queryType was not already set to something specific (like INSERT), default to SELECT
    if (this.queryType === 'SELECT') {
      this.queryType = 'SELECT';
    }
    this.columns = columns;
    this.options = options;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, operator: '=', value });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ column, operator: 'IN', value: values });
    return this;
  }

  contains(column: string, value: any) {
    this.filters.push({ column, operator: '@>', value });
    return this;
  }

  or(filters: string) {
    const conditions = filters.split(',');
    this.filters.push({ column: 'OR_CLAUSE', operator: 'OR', value: conditions });
    return this;
  }

  gt(column: string, value: any) {
    this.filters.push({ column, operator: '>', value });
    return this;
  }

  lt(column: string, value: any) {
    this.filters.push({ column, operator: '<', value });
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this.sorts.push({ column, order: ascending ? 'ASC' : 'DESC' });
    return this;
  }

  limit(count: number) {
    this.limitVal = count;
    return this;
  }

  single() {
    this.isSingle = true;
    this.limitVal = 1;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    this.limitVal = 1;
    return this;
  }

  insert(data: any) {
    this.queryType = 'INSERT';
    this.data = data;
    return this;
  }

  update(data: any) {
    this.queryType = 'UPDATE';
    this.data = data;
    return this;
  }

  upsert(data: any) {
    this.queryType = 'INSERT';
    this.data = data;
    return this;
  }

  delete() {
    this.queryType = 'DELETE';
    return this;
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {

    const promise = (async () => {
      try {
        let text = '';
        let values: any[] = [];
        let paramIndex = 1;

        // --- Handle Nested Selects ---
        let baseColumns = this.columns;
        const subqueries: string[] = [];

        // Poor man's Supabase nested join support using subqueries
        let processingSelect = this.columns.replace(/\s+/g, ' ');
        const nestedRegex = /([\w!]+):?([\w!]+)?\s*\(([^)]+)\)/;
        let match;

        while ((match = processingSelect.match(nestedRegex))) {
          const fullMatch = match[0];
          let alias = match[1];
          let table = match[2];
          let fields = match[3];

          if (!table) {
            table = alias;
          }

          // Clean up Supabase-specific syntax
          alias = alias.replace('!', '').trim();
          table = table.replace('!', '').trim();
          if (fields.trim() === '*') fields = '*';

          // Mapping for known relations in this app
          if (table === 'countries' || table === 'country') {
            subqueries.push(`(SELECT row_to_json(rel) FROM (SELECT ${fields} FROM countries WHERE id = ${this.table}.country_id) rel) as "${alias}"`);
          } else if (table === 'cities') {
            subqueries.push(`(SELECT row_to_json(rel) FROM (SELECT ${fields} FROM cities WHERE id = ${this.table}.city_id) rel) as "${alias}"`);
          } else if (table === 'photos') {
            subqueries.push(`(SELECT json_agg(rel) FROM (SELECT ${fields} FROM photos WHERE facility_id = ${this.table}.id) rel) as "${alias}"`);
          } else if (table === 'profiles' || table === 'user') {
            subqueries.push(`(SELECT row_to_json(rel) FROM (SELECT ${fields} FROM profiles WHERE id = ${this.table}.user_id) rel) as "${alias}"`);
          } else if (table === 'facilities') {
            // For bookings, the FK is facility_id
            const fk = this.table === 'bookings' ? 'facility_id' : 'id';
            subqueries.push(`(SELECT row_to_json(rel) FROM (SELECT ${fields} FROM facilities WHERE id = ${this.table}.${fk}) rel) as "${alias}"`);
          }

          processingSelect = processingSelect.replace(fullMatch, '');
        }

        // Clean up the remaining select columns - filter out any fragments containing brackets
        baseColumns = processingSelect.split(',').map(s => s.trim()).filter(s => s && !s.includes('(') && !s.includes(')')).join(', ');
        if (!baseColumns || baseColumns === '*') baseColumns = `${this.table}.*`;

        const refinedReturn = [baseColumns, ...subqueries].join(', ');

        if (this.queryType === 'SELECT') {
          // Optimized Count Query
          if (this.options?.head && this.options?.count) {
            text = `SELECT COUNT(*) as total_count FROM ${this.table}`;
          } else {
            text = `SELECT ${refinedReturn} FROM ${this.table}`;
          }

        } else if (this.queryType === 'INSERT') {
          const rows = Array.isArray(this.data) ? this.data : [this.data];
          if (rows.length === 0) throw new Error("No data to insert");

          const keys = Object.keys(rows[0]);
          const cols = keys.map(k => `"${k}"`).join(', '); // Quote identifiers

          const valPlaceholders = rows.map(row => {
            const rowPlaceholder = keys.map(k => {
              let val = row[k];
              if (val !== null && typeof val === 'object') {
                const isArray = Array.isArray(val);
                const shouldStringify = !isArray || (val.length > 0 && typeof val[0] === 'object');

                if (shouldStringify) {
                  val = JSON.stringify(val);
                }
              }
              values.push(val);
              return `$${paramIndex++}`;
            }).join(', ');
            return `(${rowPlaceholder})`;
          }).join(', ');

          text = `INSERT INTO ${this.table} (${cols}) VALUES ${valPlaceholders}`;

        } else if (this.queryType === 'UPDATE') {
          const updates = this.data;
          const keys = Object.keys(updates);
          const setClause = keys.map(k => {
            let val = updates[k];
            if (val !== null && typeof val === 'object') {
              const isArray = Array.isArray(val);
              const shouldStringify = !isArray || (val.length > 0 && typeof val[0] === 'object');

              if (shouldStringify) {
                val = JSON.stringify(val);
              }
            }
            values.push(val);
            return `"${k}" = $${paramIndex++}`;
          }).join(', ');

          text = `UPDATE ${this.table} SET ${setClause}`;
        } else if (this.queryType === 'DELETE') {
          text = `DELETE FROM ${this.table}`;
        }

        // --- WHERE Clause ---
        if (this.filters.length > 0) {
          const conditions = this.filters.map(f => {
            if (f.column === 'OR_CLAUSE') {
              const orParts = (f.value as string[]).map(condition => {
                const [col, op, val] = condition.split('.');
                if (op === 'ilike') {
                  values.push(val.replace(/%/g, ''));
                  return `${col} ILIKE $${paramIndex++}`;
                }
                return '1=1';
              });
              return `(${orParts.join(' OR ')})`;
            }

            if (f.operator === 'IN') {
              const inPlaceholders = (f.value as any[]).map(v => {
                values.push(v);
                return `$${paramIndex++}`;
              }).join(', ');
              return `${f.column} IN (${inPlaceholders})`;
            }
            let col = f.column;
            if (col.includes('.')) {
              const [relTable, relCol] = col.split('.');
              // Map potential aliases to real tables
              const tableMap: Record<string, string> = {
                'country': 'countries',
                'countries': 'countries',
                'cities': 'cities'
              };
              const realTable = tableMap[relTable] || relTable;
              const fkMap: Record<string, string> = {
                'countries': 'country_id',
                'cities': 'city_id'
              };
              const fk = fkMap[realTable];
              if (fk) {
                values.push(f.value);
                return `${this.table}.${fk} IN (SELECT id FROM ${realTable} WHERE ${relCol} ${f.operator} $${paramIndex++})`;
              }
            }

            if (f.operator === '@>') {
              values.push(f.value);
              return `${f.column} @> $${paramIndex++}::jsonb`;
            }

            values.push(f.value);
            return `${f.column} ${f.operator} $${paramIndex++}`;
          });

          const whereKeyword = this.queryType === 'UPDATE' || this.queryType === 'DELETE' || this.queryType === 'SELECT' ? 'WHERE' : '';
          if (whereKeyword) {
            text += ` ${whereKeyword} ${conditions.join(' AND ')}`;
          }
        }

        // --- ORDER BY ---
        // Don't order if we are just counting
        if (this.queryType === 'SELECT' && this.sorts.length > 0 && !(this.options?.head && this.options?.count)) {
          const sortClause = this.sorts.map(s => `${s.column} ${s.order}`).join(', ');
          text += ` ORDER BY ${sortClause}`;
        }

        // --- LIMIT ---
        // Don't limit if we are counting everything
        if (this.queryType === 'SELECT' && this.limitVal && !(this.options?.head && this.options?.count)) {
          text += ` LIMIT ${this.limitVal}`;
        }

        // --- RETURNING ---
        if (['INSERT', 'UPDATE', 'DELETE'].includes(this.queryType)) {
          text += ` RETURNING ${refinedReturn}`;
        }

        // --- Execute via HTTP Driver (Faster than Client) ---
        // console.log('SQL Executing:', text, values);
        const rows = await sql(text as any, values);

        let data: any = rows;
        let count = null;

        // Handle Count Response
        if (this.options?.head && this.options?.count) {
          count = Number(rows[0]?.total_count || 0);
          data = null; // Head requests typically don't return data
        } else {
          // Handle Single/MaybeSingle
          if (this.isSingle) {
            if (data.length === 0) throw new Error("No rows found");
            if (data.length > 1) throw new Error("Multiple rows found");
            data = data[0];
          } else if (this.isMaybeSingle) {
            data = data.length > 0 ? data[0] : null;
          }

          // Approximate count for normal select if requested (not exact but helpful)
          if (this.options?.count) {
            count = rows.length;
          }
        }

        return { data, error: null, count };

      } catch (err: any) {
        if (err.message === "No rows found") {
          return { data: null, error: { message: 'No rows found' }, count: null };
        }
        console.error('Neon Database Error:', err);
        return { data: null, error: { message: err.message }, count: null };
      }
    })();

    return promise.then(onfulfilled, onrejected);
  }
}

// --- Auth Shim ---

const authListeners: ((event: string, session: any) => void)[] = [];

const notifyAuthChange = (event: string, session: any) => {
  authListeners.forEach(cb => cb(event, session));
};

const authShim = {
  signInWithPassword: async ({ email, password }: any) => {
    try {
      const query = new QueryBuilder('profiles')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      const { data, error } = await query;

      if (error || !data) {
        return { data: { user: null, session: null }, error: { message: getShimTranslation('invalid_credentials', 'Invalid credentials') } };
      }

      const session = {
        access_token: 'mock-token-' + Date.now(),
        user: data
      };

      localStorage.setItem('neon_auth_session', JSON.stringify(session));
      notifyAuthChange('SIGNED_IN', session);
      return { data: { user: data, session }, error: null };
    } catch (e) {
      return { data: { user: null, session: null }, error: e };
    }
  },

  signInWithOAuth: async (options: any) => {
    console.log('Mock OAuth sign in', options);
    return { data: { url: window.location.origin, provider: options.provider }, error: null };
  },

  signUp: async ({ email, password, options }: any) => {
    // 1. Check if user already exists
    const check = await new QueryBuilder('profiles').select('id').eq('email', email).single();

    if (check.data) {
      return { data: { user: null }, error: { message: getShimTranslation('user_exists', 'User already exists') } };
    }

    const userId = uuidv4();

    // 2. Insert into neon_auth.user FIRST (Required by Foreign Key)
    const authUser = {
      id: userId,
      name: options.data.name || '',
      email: email,
      emailVerified: false,
      updatedAt: new Date().toISOString()
    };

    const { error: authError } = await new QueryBuilder('"neon_auth"."user"').insert(authUser).single();

    if (authError) {
      console.error("Failed to create auth user", authError);
      return { data: { user: null }, error: authError };
    }

    // 3. Insert new user into profiles
    const newUser = {
      id: userId,
      email,
      password,
      ...options.data
    };

    Object.keys(newUser).forEach(key => newUser[key] === undefined && delete newUser[key]);

    const { data, error } = await new QueryBuilder('profiles').insert(newUser).single();

    if (error) return { data: { user: null }, error };

    const session = { access_token: 'mock-token-' + Date.now(), user: data };
    localStorage.setItem('neon_auth_session', JSON.stringify(session));
    notifyAuthChange('SIGNED_IN', session);

    return { data: { user: data, session }, error: null };
  },

  signOut: async () => {
    localStorage.removeItem('neon_auth_session');
    notifyAuthChange('SIGNED_OUT', null);
    return { error: null };
  },

  getSession: async (): Promise<{ data: { session: AuthSession | null }, error: any }> => {
    const stored = localStorage.getItem('neon_auth_session');
    if (stored) {
      try {
        return { data: { session: JSON.parse(stored) as AuthSession }, error: null };
      } catch (e) {
        localStorage.removeItem('neon_auth_session');
      }
    }
    return { data: { session: null }, error: null };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    authListeners.push(callback);
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = authListeners.indexOf(callback);
            if (index > -1) authListeners.splice(index, 1);
          }
        }
      }
    };
  },

  updateUser: async (attributes: any) => {
    const stored = localStorage.getItem('neon_auth_session');
    if (stored) {
      const session = JSON.parse(stored);
      const userId = session.user.id;

      if (attributes.password) {
        const { error } = await new QueryBuilder('profiles').update({ password: attributes.password }).eq('id', userId);
        return { error };
      }
    }
    return { error: { message: getShimTranslation('no_session', 'No session') } };
  },

  resetPasswordForEmail: async (email: string, options?: any) => {
    console.log(`Password reset requested for ${email}`, options);
    return { error: null };
  }
};

// --- Storage Shim (Cloudflare R2) ---

const storageShim = {
  from: (bucket: string) => ({
    upload: async (path: string, file: File) => {
      try {
        const key = path;

        // Convert File to ArrayBuffer/Uint8Array for browser compatibility
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const command = new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          ContentLength: buffer.length, // Explicitly set length to avoid Node.js fs dependencies
        });

        await s3Client.send(command);

        const publicUrl = `${R2_PUBLIC_URL}/${key}`;

        return { data: { path: key, fullPath: key, publicUrl }, error: null };

      } catch (err: any) {
        console.error('R2 Upload Error:', err);
        return { data: null, error: err };
      }
    },
    getPublicUrl: (path: string) => {
      return { data: { publicUrl: `${R2_PUBLIC_URL}/${path}` } };
    },
    remove: async (path: string) => {
      try {
        const command = new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: path,
        });
        await s3Client.send(command);
        return { error: null };
      } catch (err: any) {
        console.error('R2 Delete Error:', err);
        return { error: err };
      }
    }
  })
};

// --- Main Client Object ---

export const neon = {
  from: (table: string) => new QueryBuilder(table),
  auth: authShim,
  storage: storageShim
};