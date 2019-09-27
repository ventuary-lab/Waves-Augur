
const ITEMS_PER_PAGE = 10;

class ResponseController {
    static count = ITEMS_PER_PAGE;

    // Page param is zero based
    static handleRequest (page, items) {
        const totalItems = items.length;

        return {
            data: items.slice(page),
            totalItems,
            totalPages: this.getTotalPages(totalItems)
        };
    }

    static getTotalPages (totalItems) {
        return Math.ceil(totalItems / this.count);
    };

    static sliceEntitiesList (items, page, count = this.count) {
        const [
            start, end
        ] = [
            page * count, 
            (1 + page) * count
        ];

        return items.slice(start, end);
    }

    static getSlicedEntities (request, entities) {
        const { page } = request.query;

        if (page) {
            return this.sliceEntitiesList(entities, Number(page));
        };

        return entities;
    }
}

module.exports = ResponseController;