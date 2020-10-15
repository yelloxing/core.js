QUnit.test('get', 4, function () {

    var object = { a: { b: [1, 2, 3] } };

    equal(JSON.stringify(__.get(object, 'a.b')), "[1,2,3]");
    equal(__.get(object, 'a["b"][1]'), 2);
    equal(__.get(object, 'a.c', 'default'), 'default');

    equal(__.get(object, '["a"].b[0]'), '1');

});
