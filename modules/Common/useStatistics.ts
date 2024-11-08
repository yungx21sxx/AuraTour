interface UpdateStatisticsBody {
    metric: 'views' | 'likes' | 'favorites' | 'bookings' | 'revenue' | 'submits';
    value: number;
}

export default () => {
    async function incrementStatistic(metric: 'views' | 'likes' | 'favorites' | 'bookings' | 'revenue' | 'submits', listingId: number) {
        return $fetch(`/api/statistics/${listingId}/update`, {
            method: 'POST',
            body: {
                metric,
                value: 1
            }
        })
    }
    return {
        incrementStatistic
    }
}