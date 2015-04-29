Template.personItem.helpers({
	path: function () {
	    return Router.path('home', this.person);
	},
	firstName: function() {
		return this.name;
	}
});