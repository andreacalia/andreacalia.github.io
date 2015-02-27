define([
  'dojo/query',
  'dojo/dom',
  'dojo/dom-class',
  'dojo/dom-style',
  'dojo/topic',
  'dojo/on',

  'app/map-widget',

  'dojo/domReady!'],
function(
  query, dom, domClass, domStyle, topic, on,
  MapWidget
) {
  'use strict';

  var app = {};

  var _showSidebar = function() {

    domClass.toggle(window.document.body, 'sidebar-open');

  };

  // Sidebar button
  on(dom.byId('sidebar-toggle'), 'click', _showSidebar);


  app.mapWidget = new MapWidget({}, 'mapControls')


  // app topics
  // set app title and about text when loading from web map
  topic.subscribe('webmap/load', function(args) {
    var item;
    if (!args.itemInfo && args.itemInfo.item) {
      return;
    }
    item = args.itemInfo.item;
    app.aboutModal.set('title', item.title);
    app.aboutModal.set('content', item.description);
    app.navBar.set('title', item.title);
  });

  // set the basemap
  topic.subscribe('basemap/set', function(args) {
    app.mapWidget.setBasemap(args.basemap);
  });

  // toggle the sidebar

  // show the about modal
  topic.subscribe('about/show', function() {
    query('.about-modal').modal('show');
  });

  return app;
});