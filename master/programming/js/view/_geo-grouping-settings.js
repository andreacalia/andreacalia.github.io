define([
    'jquery',
    'underscore',
    'backbone',
    'text!resources/templates/geo-grouping-settings.html'
], function($, _, Backbone, template) {

    var GeoGrupingSettingsView = Backbone.View.extend({

        initialize: function(args) {

            if( _.isUndefined(args.groupsCollection) )
                throwError(new Error('No groups passed to geo setting view'));

            this.groupsCollection = args.groupsCollection;

            this.template = template;
        },

        render: function(){

            var compiled = _.template(this.template)({groups: this.groupsCollection})
            this.$el.html(compiled);

            // Enable JS components
            this.$el.find('#geo-grouping-group-enabler').bootstrapSwitch({
                size: 'small'
            });
            this.$el.find('.geo-grouping-group-warning').tooltip();

            // Event listeners
            this.$el.find('#geo-grouping-group-enabler').on('switchChange.bootstrapSwitch', _.bind(this._groupEnablerChanged, this));
            this.$el.find('input[type="checkbox"]').on('change', _.bind(this._groupChanged, this)); // Enable or disable conflicts
            this.$el.find('input[type="checkbox"]').on('change', _.bind(this._triggerChangeGroupSelection, this)); // Trigger visualization

            // Defaults
            this._disableGrouping();
        },

        _triggerChangeGroupSelection: function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

            var selectedIDs = _.reduce(this.$el.find('.geo-grouping-group-entry > input:checked'), function(memo, el) {

                memo.push($(el).parent().attr('data-group-id'));
                return memo;

            }, [])
            
            this.trigger('change:group-selection', selectedIDs);
        },

        _groupChanged: function(evt) {

            evt.preventDefault();
            evt.stopPropagation();

            var target = $(evt.target);
            
            // Find conflicting groups
            var targetGroupID = target.parent().attr('data-group-id');
            var conflictingGroups = this.groupsCollection.get(targetGroupID).get('groupConflicts'); // [{id, name}, ...]

            // Find which function is appropriate
            var applier = target.prop('checked') ? this._disableConflictingEntry : this._enableConflictingEntry;

            _.each(conflictingGroups, function(conflictingGroup) {

                // Select the entry
                var conflictingEntry = this.$el.find('p[data-group-id="' + conflictingGroup.id + '"]');

                applier.call(this, conflictingEntry);

            }, this)
        },

        _disableConflictingEntry: function(entry) {

            // Checkbox
            entry.find('input[type="checkbox"]')
                    .attr('disabled', 'disabled') // Disable the checkbox
                    .addClass('disabled') // Add disable CSS class
                    .prop('checked', false); // Untick the checkbox
            // Label
            entry.find('.geo-grouping-group-label')
                    .addClass('disabled'); // Add disable CSS class
            // Warning
            entry.find('.geo-grouping-group-warning').show();            
        },

        _enableConflictingEntry: function(entry) {

            // Checkbox
            entry.find('input[type="checkbox"]')
                    .removeAttr('disabled') // Enable the checkbox
                    .removeClass('disabled') // Remove disable CSS class
                    .prop('checked', false); // Untick the checkbox
            // Label
            entry.find('.geo-grouping-group-label')
                    .removeClass('disabled'); // Remove disable CSS class
            // Warning
            entry.find('.geo-grouping-group-warning').hide();
        },

        _groupEnablerChanged: function(evt, state) {

            evt.preventDefault();
            evt.stopPropagation();

            var event = '';

            state ? this._enableGrouping() : this._disableGrouping();

            this.trigger('change:groups-state', state);
        },

        _enableGrouping: function() {

            this.$el.find('.geo-grouping-group-entry').each(_.bind(function(i, entry) {

                var entry = $(entry);
                entry.removeClass('disabled');
                entry.find('input[type="checkbox"]').removeAttr('disabled');

            }, this));
        },

        _disableGrouping: function() {

            this.$el.find('.geo-grouping-group-entry').each(_.bind(function(i, entry) {

                var entry = $(entry);

                // Enable the entry if it was a conflict (because conflict disable is different from this kind of disable)
                this._enableConflictingEntry(entry);

                entry.addClass('disabled'); // Add disable CSS class
                entry.find('input[type="checkbox"]')
                    .attr('disabled', 'disabled'); // Disable the checkbox

            }, this));
        }

    });

    return GeoGrupingSettingsView;
});