/**
 * @file
 * Enforce max_file_count for Plupload elements.
 */
(function($) {
  Drupal.behaviors.islandoraPlupload = {
    attach: function (context, settings) {
      $('form').find('.plupload-element').each( function(index){
        var element = $(this);
        var uploader = $(this).pluploadQueue();
        var id = $(this).attr('id');
        var maxFiles = settings.plupload[id].max_file_count;

        if (id && maxFiles) {
          uploader.bind('FilesAdded', function(up, files) {
            var maxFiles = settings.plupload[id].max_file_count;
            if (up.files.length > maxFiles) {
              up.splice(maxFiles);
              alert(Drupal.formatPlural(maxFiles, 'Only one file may be uploaded.', 'Only @count files may be uploaded.'));
            }
            if (up.files.length === maxFiles) {
              $('.plupload_add', element).hide('slow');
            }
          });

          uploader.bind('FilesRemoved', function(up, files) {
            if (up.files.length < maxFiles) {
              $('.plupload_add', element).show('slow');
            }
          });

          var total_upload_files = 0;             
          uploader.bind('FileUploaded', function(up, file, res) {
            total_upload_files--;
            if (uploader.total.uploaded == uploader.files.length) {
              if ($('form[class="plupload-form-processed"]').size() > 0) {
                setTimeout(function() {
                  $('form[class="plupload-form-processed"]').first().submit();
                }, 550);
              }
            }
          });
          uploader.bind('QueueChanged', function(up, files) {
            total_upload_files = uploader.files.length;
          });
        }
      });
    }
  }
})(jQuery);
