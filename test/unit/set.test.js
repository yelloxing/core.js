QUnit.test('set', 4, function () {

    var object = {
        a: {
            b: [1, 2, 3]
        }
    };

    deepEqual(__.set(object, 'a.c', 10), {
        "a": {
            "b": [1, 2, 3],
            "c": 10
        }
    });

    deepEqual(__.set(object, 'a.e[g]', {
        "newValue": "-_-"
    }), {
        "a": {
            "b": [1, 2, 3],
            "c": 10,
            "e": {
                "g": {
                    "newValue": "-_-"
                }
            }
        }
    });

    deepEqual(__.set(object, 'a.2.1', '_-_', function () {
        return [];
    }), {
        "a": {
            "2": [undefined, "_-_"],
            "b": [1, 2, 3],
            "c": 10,
            "e": {
                "g": {
                    "newValue": "-_-"
                }
            }
        }
    });

    deepEqual(__.set(object, '["a"].b', 10), {
        "a": {
            "2": [undefined, "_-_"],
            "b": 10,
            "c": 10,
            "e": {
                "g": {
                    "newValue": "-_-"
                }
            }
        }
    });

});
