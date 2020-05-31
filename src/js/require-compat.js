const messages = (function() {
    return {
        addError: (message) => {
            console.log(message);
        },

        addWarning: (message) => {
            console.log(message);
        },

        addMessage: (message) => {
            console.log(message);
        },
    }
})();

export default function(modules, callback) {
    callback(messages);
}
