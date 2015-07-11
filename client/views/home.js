if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Session.setDefault('activePage', 'index');

  var the50 = [
    {
      name: 'Margaret Nasha',
      category: 'Politician',
      position: 1,
      slug: 'margret-nasha',
      thumb: 'nasha-bg.png'
    },
    {
      name: 'John Doe',
      category: 'Unknown',
      position: 2,
      slug: 'john-doe',
      thumb: 'unknown-person.png'
    },
    {
      name: 'UFO',
      category: 'Unknown',
      position: 3,
      slug: 'ufo',
      thumb: 'alien-512.png'
    },
    {
      name: 'Radio Head',
      category: '',
      position: 4,
      slug: 'radio-head',
      thumb: 'unknown-person.png'
    }
  ];

Template.home.onRendered(function() {

  Pages = (function() {
    var $main = this.$('.m-pages'),
        $pages = [],
        $next = this.$('.nav-next'),
        $previous = this.$('.nav-previous'),
        $page_links = this.$('a[data-page]'),
        pages_count = 0,
        $body = $('body'),
        page_class = 'm-pages__page',
        total_pages_seen = 0,
        current = 0,
        is_animating = false,
        end_current_page = false,
        end_next_page = false,
        animation_end_events = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
      },
      animation_end_event = animation_end_events[Modernizr.prefixed('animation')],
      support = Modernizr.cssanimations,
      url_prefix = '/';

          // Goes to the next page, duh.
        var nextPage = function (e) {
          goToPage(current + 1);
          return false;
        };

        // Same as above, but backwards.
        var previousPage = function (e) {
          goToPage(current - 1);
          return false;
        };

        // Goes to the page with the given ID.
        var goToId = function (id) {
          var index = $('#' + id).index();
          goToPage(index);
          return false;
        };

        var goToPage = function (index) {
          var $current_page, $next_page, out_class, in_class;

          // If the page is already animating, GTFO.
          if (is_animating) {
            return false;
          }


          // If going to the same page I'm already in, or the desired page
          // is before the first one or after the last one,
          // call the function that triggers the rubber band animation and GTFO.
          if (index >= pages_count || index < 0 || index === current) {
            goToSamePage(index);
            return false;
          }

          total_pages_seen += 1;

          // These classes determine the direction of the animations, depending
          // on which direction I'm moving.
          if (index > current) {
            out_class = 'to-left';
            in_class = 'from-right';
          } else {
            out_class = 'to-right';
            in_class = 'from-left';
          }

          is_animating = true;

          // Close the nav.
          $body.removeClass('open-nav');

          // Get the currently visible page.
          $current_page = $pages.eq(current);

          // Check to see if it is time to inject an ad
          // Note this might need to modify index value
          //index = checkForAdContent(index);

          current = index;

          //Remove current page
          $current_page.removeAttr('style').removeClass('current');

          // Make the new page the current page.
          $next_page = $pages.eq(current).removeAttr('style').addClass('current');

          //We could add animation and events when animation ends but for now..

          onNewPageView($next_page);
          is_animating = false;
          $next_page.css('overflow-y', 'auto');

        };

        // If going to the same page, does a simple "rubber band bounce"
        // animation.
        var goToSamePage = function (index) {
          var $current_page = $pages.eq(current),
              animation_class;

          is_animating = true;

          if (index < 0) {
            animation_class = 'bounce-right';
          } else {
            animation_class = 'bounce-left';
          }

          $current_page.addClass(animation_class).on(animation_end_event, function() {
            $current_page.off(animation_end_event);
            onEndAnimation($current_page);
          });

          if(!support) {
            onEndAnimation($current_page);
          }
        };

        var onEndAnimation = function($in_page, $out_page) {
          //removeAdIfWasJustSeen($pages.index($out_page));
          end_current_page = false;
          end_next_page = false;
          is_animating = false;
          $in_page.attr({ class : $in_page.data().original_class + ' current' });
          $in_page.css('overflow-y', 'auto');
          if (typeof $out_page !== 'undefined') {
            $out_page.attr({ class : $out_page.data().original_class }).scrollTop(0);
          }
          //picturefill($in_page);
        };

        var onNewPageView = function($page) {
          var page_url, new_url;

          page_url = $page.data('page-url');
          new_url = _.isUndefined(page_url) ? url_prefix : page_url;

          updateBodyClass($page);
          updatePageTitle($page);
          updatePageUrl(new_url);
        };

        // Updates browser's URL if it supports HTML5 History API.
        var updatePageUrl = function (url) {
          var state;

          if (Modernizr.history) {

            if (url === location.pathname) {
              return;
            }

            state = {
              id: _.uniqueId(),
              url: url
            };

            window.history.pushState(state, '', url);
          }
        };

        var updatePageTitle = function ($page) {
          var id = $page.attr('id'),
              name = $page.data('name');
          if (typeof id !== 'undefined' && typeof name !== 'undefined') {
            document.title = name + " | " + "VGBots";
          } else {
            document.title = "VGBots";
          }
        };

          var updateBodyClass = function ($page) {
            if ($page.hasClass('page')) {
              $body.attr('class', 'has-sponsorship ' + $page.attr('id'));
            }
          };

          // Load up all em pages!
        var setupPages = function(){
          $pages = $main.children('li');
          pages_count = $pages.length;
        };

        var init = function () {
          setupPages();

          var pathname_array = window.location.pathname.split('/'),
              pathname = pathname_array[pathname_array.length - 1],
              $current_page;

          $next.on('click', { source: 'Arrows'}, nextPage);
          $previous.on('click', { source: 'Arrows'}, previousPage);

          $main.touchwipe({
            wipeLeft: function () {
              nextPage();
            },
            wipeRight: function() {
              previousPage();
            },
            preventDefaultEvents: false
          });
          //$page_links.on('click', clickToPage);
          //$(document).on('keydown', { source: 'Keyboard'}, keyboardNav);
          //$list_toggles.on('click', toggleListLayout);

          // $('.cover-link').click('a', function (e) {
          //   if (e.which === 1 && !e.metaKey && !e.ctrlKey) {
          //     e.preventDefault();
          //     _gaq.push(['_trackEvent', Verge.Context.app_name, 'Navigation', 'Home']);
          //     goToPage(0);
          //   }
          // });

          // Stores each page's CSS class as a data attribute so I can reset it after
          // animating it.
          $pages.each(function() {
            var $page = $(this);
            $page.data().original_class = $page.attr('class');
          });

          // If I land at a page's URL, mark that page as current, and do the overflow
          // thing to fix Safari. Else, go to the first page.
          if (pathname && $('#' + pathname).length > 0) {
            $current_page = $('#' + pathname).addClass('current').css('overflow-y', 'auto');
            current = $current_page.index();
          } else {
            $current_page = $pages.eq(current).addClass('current').css('overflow-y', 'auto');
          }

          // Call picture fill on the current page.
          //picturefill($current_page);

          window.onpopstate = function(event) {
            //console.log("location: " + window.location + ", state: " + JSON.stringify(event.state));

            var _pathname_array = window.location.pathname.split('/'),
              _pathname = _pathname_array[_pathname_array.length - 1],
              _$current_page;


            // If I land at a page's URL, mark that page as current, and do the overflow
            // thing to fix Safari. Else, go to the first page.
            if (_pathname && $('#' + _pathname).length > 0) {
              _$current_page = $('#' + _pathname).addClass('current').css('overflow-y', 'auto');
              current = _$current_page.index();
            } else {
              $pages.eq(current).removeAttr('style').removeClass('current');
              current = 0;
              _$current_page = $pages.eq(current).addClass('current').css('overflow-y', 'auto');
            }
          };

        };

    return {
      init: init,
      nextPage : nextPage,
      previousPage : previousPage,
      goToPage : goToPage
    };
  })();


    var ACTIVE_PAGE = Router.current().params.slug;
    //$('body').addClass(ACTIVE_PAGE);
    Pages.init();
  });

  Template.home.helpers({
    counter: function () {
      return Router.current();
    },
    the50: function() {
      return the50;
    }
  });

 
  Template.home.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}