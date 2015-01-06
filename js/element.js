/*jshint browser: true, devel:true*/
/*global jQuery, Drupal, plupload*/
/**
 * @file
 * Enforce max_file_count for Plupload elements.
 */
(function($) {
  'use strict';
  Drupal.behaviors.islandoraPlupload = {
    attach: function (context, settings) {
      $('form', context).find('.plupload-element').each(function (index) {
        $(this).once('islandoraPlupload', function () {
          var element = $(this);
          var uploader = element.pluploadQueue();
          var id = element.attr('id');
          var maxFiles = settings.plupload[id].max_file_count;

          if (id && maxFiles) {
            uploader.bind('FilesAdded', function (up, files) {
              var maxFiles = settings.plupload[id].max_file_count;
              if (up.files.length > maxFiles) {
                up.splice(maxFiles);
                alert(Drupal.formatPlural(maxFiles, 'Only one file may be uploaded.', 'Only @count files may be uploaded.'));
              }
              if (up.files.length === maxFiles) {
                $('.plupload_add', element).hide('slow');
              }
            });
            uploader.bind('FilesRemoved', function (up, files) {
              if (up.files.length < maxFiles) {
                $('.plupload_add', element).show('slow');
              }
            });
          }
        });
      });
    }
  };
})(jQuery);
