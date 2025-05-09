-- Create facility_reviews table
CREATE TABLE facility_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for facility_reviews
CREATE INDEX idx_facility_reviews_facility_id ON facility_reviews(facility_id);
CREATE INDEX idx_facility_reviews_user_id ON facility_reviews(user_id);

-- Enable RLS for facility_reviews
ALTER TABLE facility_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for facility_reviews
CREATE POLICY "Anyone can view reviews"
  ON facility_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for facilities they've booked"
  ON facility_reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE user_id = auth.uid() 
      AND facility_id = facility_reviews.facility_id
      AND status = 'completed'
    )
  );

CREATE POLICY "Users can update their own reviews"
  ON facility_reviews FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews"
  ON facility_reviews FOR DELETE
  USING (user_id = auth.uid());

-- Create function to update facility rating
CREATE OR REPLACE FUNCTION update_facility_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the facility's rating and total_reviews
  WITH review_stats AS (
    SELECT 
      COUNT(*) as total,
      AVG(rating)::DECIMAL(3,2) as avg_rating
    FROM facility_reviews
    WHERE facility_id = COALESCE(NEW.facility_id, OLD.facility_id)
  )
  UPDATE facilities
  SET 
    rating = COALESCE((SELECT avg_rating FROM review_stats), 0),
    total_reviews = COALESCE((SELECT total FROM review_stats), 0)
  WHERE id = COALESCE(NEW.facility_id, OLD.facility_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update facility rating
CREATE TRIGGER update_facility_rating_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON facility_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_facility_rating();

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON facility_reviews
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Create types for TypeScript
COMMENT ON TABLE facility_reviews IS E'@typegen
type FacilityReview = {
  id: string;
  facility_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}';
