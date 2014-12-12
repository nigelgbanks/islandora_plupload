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
          var $element = $(this);
          var uploader = $element.pluploadQueue();
          var id = $element.attr('id');
          var maxFiles = settings.plupload[id].max_file_count;

          if (id && maxFiles) {
            uploader.bind('FilesAdded', function (up, files) {
              var maxFiles = settings.plupload[id].max_file_count;
              if (up.files.length > maxFiles) {
                up.splice(maxFiles);
                alert(Drupal.formatPlural(maxFiles, 'Only one file may be uploaded.', 'Only @count files may be uploaded.'));
              }
              if (up.files.length === maxFiles) {
                $('.plupload_add', $element).hide('slow');
              }
            });
            uploader.bind('FilesRemoved', function (up, files) {
              if (up.files.length < maxFiles) {
                $('.plupload_add', $element).show('slow');
              }
            });
            uploader.bind('FileUploaded', function (up, file, res) {
              // Total is all the pluploader elements in this plupload element's
              // form.
              var $form = $element.parents('form');
              var $pluploaders = $('.plupload-element', $form);
              var total = $pluploaders.length;
              var completed = 0;
              // Only check all if this one is finished.
              if (uploader.total.uploaded === uploader.files.length) {
                $pluploaders.each(function (index) {
                  var uploader = $(this).pluploadQueue();
                  if (uploader.total.uploaded === uploader.files.length) {
                    completed++;
                  }
                });
              }
              if (completed === total) {
                setTimeout(function () {
                  $element.parents('form').first().submit();
                }, 550);
              }
            });
          }
        });
      });
    }
  };
})(jQuery);
