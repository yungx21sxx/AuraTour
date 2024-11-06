import type {ReviewCreateDTO} from "~/modules/Listing/types/dto.types";
import type {IReviewResponse} from "~/modules/Listing/types/response.types";

export class ReviewsApi {
    static fetchReviews(listingId: number): Promise<IReviewResponse[]> {
        return $fetch(`/api/reviews/listing/${listingId}`)
    }

    static createOrUpdateReview(operation: 'CREATE' | 'UPDATE', isAdmin: boolean, dto: ReviewCreateDTO, reviewId: number | null):
        Promise<{success: boolean, review: IReviewResponse}>
    {
        const {createdAt, userName, ...reviewCreateByUserDTO} = dto;

        const path = operation === 'CREATE' ? '/api/reviews/create' : `/api/reviews/${reviewId}`


        return $fetch(path, {
            method: operation === 'CREATE' ? 'POST' : 'PUT',
            body: isAdmin ? dto : reviewCreateByUserDTO,
        })
    }

    static deleteReview(reviewId: number) {
        return $fetch(`/api/reviews/${reviewId}`, {
            method: "DELETE"
        })
    }
}