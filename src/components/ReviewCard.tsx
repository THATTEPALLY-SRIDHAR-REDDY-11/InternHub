import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';

interface Review {
  _id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{review.user_name}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(review.created_at), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{review.comment}</p>
      </CardContent>
    </Card>
  );
};
