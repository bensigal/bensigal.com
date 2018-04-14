define(['dart_sdk'], function(dart_sdk) {
  'use strict';
  const core = dart_sdk.core;
  const html = dart_sdk.html;
  const dart = dart_sdk.dart;
  const dartx = dart_sdk.dartx;
  const www__test__test = Object.create(null);
  let VoidTovoid = () => (VoidTovoid = dart.constFn(dart.fnType(dart.void, [])))();
  www__test__test.main = function() {
    core.print("Hello, world!");
    html.window.alert("hello world");
  };
  dart.fn(www__test__test.main, VoidTovoid());
  dart.trackLibraries("test", {
    "www/test/test.dart": www__test__test
  }, null);
  // Exports:
  return {
    www__test__test: www__test__test
  };
});

//# sourceMappingURL=test.js.map
