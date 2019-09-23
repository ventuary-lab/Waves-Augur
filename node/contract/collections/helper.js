

function filterByDemoName (item) {
    return item.name.indexOf('[demo]') === -1;
}

module.exports = {
    filterByDemoName
};