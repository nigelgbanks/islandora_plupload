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
  // XXX: To allow for jp2 files to be uploaded when a plupload field is using
  // extension restriction with jp2 as one of the restricted options. The
  // MIME type must be added to plupload support MIME types for it to be added
  // in the <input> accept Attribute. Since the plupload version is below 2.x
  // the plupload mimeTypes variable needs to be modified directly using the
  // plupload object, instead of using mOxie.Mime.addMimeType("image/jp2, jp2").
  window.plupload.mimeTypes['jp2'] = 'image/jp2';
})(jQuery);
