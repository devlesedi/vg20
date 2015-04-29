Handlebars.registerHelper('activePage', function() {
  // includes Spacebars.kw but that's OK because the route name ain't that.
  var slugNames = arguments;

  return _.include(slugNames, Router.current().params.slug) && 'current';
});