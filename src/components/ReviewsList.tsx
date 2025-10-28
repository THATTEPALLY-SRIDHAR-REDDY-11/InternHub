import { useEffect, useState, useCallback } from 'react';
import { ReviewCard } from './ReviewCard';
import { Star, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Review {
  _id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsListProps {
  targetType: 'internship' | 'project';
  targetId: string;
  refreshTrigger?: number;
}

export const ReviewsList = ({ targetType, targetId, refreshTrigger }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:4000/reviews/${targetType}/${targetId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating || 0);
      setCount(data.count || 0);
    } catch (err) {
      setError('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {count > 0 && (
        <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Based on {count} review{count !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};
