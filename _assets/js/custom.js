//= require 'vendor/jquery-2.1.4.min'
//= require 'vendor/tether'
//= require 'vendor/bootstrap'
//= require 'vendor/jquery.dataTables.min'
//= require 'vendor/dataTables.bootstrap.min'
//= require 'vendor/moment.min'
//= require 'vendor/dataTables.plugins.datetime_moment'
//= require 'vendor/jquery.githubRepoWidget'
//= require 'vendor/jXHR'
//= require 'vendor/featherlight'

var github = (function(){
    function escapeHtml(str) {
        return $('<div/>').text(str).html();
    }
    function render(target, repos){
        var i = 0, fragment = '', t = $(target)[0];

        for(i = 0; i < repos.length; i++) {
            fragment += '<a class="list-group-item" href="' + repos[i].html_url + '">'
            fragment += '<h4 class="list-group-item-heading">' + repos[i].name
            if (repos[i].language) {
                fragment += '<span class="badge pull-right">' + escapeHtml(repos[i].language) + '</span>'
            }
            fragment += '</h4><p>' + escapeHtml(repos[i].description || '') + '</p></a>';
        }
        t.innerHTML = fragment;
    }
    return {
        showRepos: function(options){
            $.ajax({
                url: "https://api.github.com/users/"+options.user+"/repos?sort=pushed&callback=?"
                , dataType: 'jsonp'
                , error: function (err) { $(options.target + ' li.loading').addClass('error').text("Error loading feed"); }
                , success: function(data) {
                    var repos = [];
                    if (!data || !data.data) { return; }
                    for (var i = 0; i < data.data.length; i++) {
                        if (options.skip_forks && data.data[i].fork) { continue; }
                        repos.push(data.data[i]);
                    }
                    if (options.count) { repos.splice(options.count); }
                    render(options.target, repos);
                }
            });
        }
    };
})();


$(document).ready(function() {
    function reverse(value) {
        return value.split("").reverse().join("");
    }

    // activate tooltips
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    // make those obfuscated email links clickable
    $('a.email-obfuscated').each(function() {
        var email = $(this).data('email');
        $(this).attr('href', 'mailto:' + reverse(email));
    });

    // from http://stackoverflow.com/a/20469901/588243
    $.extend({
        replaceTag: function (currentElem, newTagObj, keepProps) {
            var $currentElem = $(currentElem);
            var i, $newTag = $(newTagObj).clone();
            if (keepProps) {
                newTag = $newTag[0];
                newTag.className = currentElem.className;
                $.extend(newTag.classList, currentElem.classList);
                $.extend(newTag.attributes, currentElem.attributes);
            }
            $currentElem.wrapAll($newTag);
            $currentElem.contents().unwrap();
            return this;
        }
    });
    $.fn.extend({
        replaceTag: function (newTagObj, keepProps) {
            return this.each(function() {
                jQuery.replaceTag(this, newTagObj, keepProps);
            });
        }
    });

    //
    // Beautify Ref Lists
    //
    $('ol.bibliography').each(function() {
        $(this).addClass('list-group');
        $(this).find('li').each(function() {
            $(this).addClass('list-group-item');
            $(this).find('.bibtex-entry-container').addClass('container-fluid')
                .find('>div').addClass('row')
                .find('.bibtex-ref-meta').removeClass('hidden');
            $(this).find('.bibtex-ref-entry').addClass('col-md-9 col-sm-12');
        });
    });

    $('#project-categories-accordion .collapse').each(function() {
       $(this).collapse('hide');
    });

    $('#hide-event-meta').click(function() {
        $('#show-event-meta-wrapper').toggleClass('invisible');
        $('#event-aside').toggleClass('in col-lg-5 col-sm-12');
        $('#event-content').toggleClass('col-lg-7').toggleClass('col-lg-12');
    });

    $('#show-event-meta').click(function() {
        $('#show-event-meta-wrapper').toggleClass('invisible');
        $('#event-aside').toggleClass('in col-lg-5 col-sm-12');
        $('#event-content').toggleClass('col-lg-7').toggleClass('col-lg-12');
    });

    $('#people-db').DataTable({
        "columnDefs": [
            { "orderable": false, "targets": 5 } // column 'Topics' should not be sortable
        ],
        "lengthMenu": [ [5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
        "pageLength": 10,
        "language": {
            "lengthMenu": "Display _MENU_ people"
        }
    });

    $('#stats-institutes').DataTable({
        "info": false,
        "paging": false,
        "searching": false,
        "columns": [
            null,
            {"type": "num"},
            {"type": "num"},
            {"type": "num"}
        ]
    });

    $.fn.dataTable.moment('DD MMM YYYY');
    $('#visits-db').DataTable({
        "lengthMenu": [ [5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]],
        "pageLength": 25,
        "language": {
            "lengthMenu": "Display _MENU_ visits"
        }
    });
});
