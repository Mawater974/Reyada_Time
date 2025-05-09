-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_facility_id ON bookings(facility_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Facility owners can view their facility bookings"
  ON bookings FOR SELECT
  USING (
    facility_id IN (
      SELECT id FROM facilities 
      WHERE auth.uid() IN (
        SELECT id FROM auth.users 
        WHERE auth.jwt() ->> 'role' IN ('admin', 'super_admin')
      )
    )
  );

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pending bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = user_id 
    AND status = 'pending'
  );

CREATE POLICY "Admins can update any booking"
  ON bookings FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE auth.jwt() ->> 'role' IN ('admin', 'super_admin')
    )
  );

-- Create type for TypeScript
COMMENT ON TABLE bookings IS E'@typegen
type Booking = {
  id: string;
  user_id: string;
  facility_id: string;
  start_time: string;
  end_time: string;
  total_price: number;
  currency: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "refunded" | "failed";
  payment_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}';
