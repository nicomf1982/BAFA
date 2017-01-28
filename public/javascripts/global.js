$(document).ready( function() {

  'use strict';

  function loginAgain (){
    $('#myModal').modal('show');
  }

  $(document).on('change', $('#upload-avatar'), function(input) {
        if (input.target && input.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#avatar')
                    .attr('src', e.target.result)
                    .width(132)
                    .height(132);
            };
            reader.readAsDataURL(input.target.files[0]);
        }
    });


  $('#loginBtn').click(function(){
    event.preventDefault();
    return;
  });

  $('#remove-user').click(function(){
    event.preventDefault();
    return;
  });

  $('[data-toggle="tooltip"]').tooltip();

  $('#new-password-form').submit(function () {
    var queryUrl = ($(location).attr('search'));
    $.ajax({
      type: 'POST',
      url: '/user/resetPassword' + queryUrl,
      dataType: 'json',
      cache: false,
      data: $(this).serialize(),
    }).done(function (data) {
        $('#ajax-panel').html('<div class="alert alert-success text-center"> <p> <strong>Success!</strong> ' + data.message || data.statusText || 'Operation Complete' + '<p/> </div>');
      })
      .fail(function (data) {
        $('#ajax-panel').html('<div class="alert alert-danger text-center"> <p>' + data.message || data.statusText || 'Operation Complete' + '<p/> </div>');
      })
    event.preventDefault();
  })

  $('#forgot-form').submit(function () {
    console.log($(this).serialize());
    $.ajax({
      type: 'POST',
      url: '/forgot',
      dataType: 'json',
      cache: false,
      data: $(this).serialize(),
    }).done(function (data) {
        $('#ajax-panel').html('<div class="alert alert-success text-center"> <p> <strong>Success!</strong> ' + data.message || data.statusText || 'Operation Complete' + '<p/> </div>');
      })
      .fail(function (data) {
        $('#ajax-panel').html('<div class="alert alert-danger text-center"> <p>' + data.message || data.statusText || 'Operation Complete' + '<p/> </div>');
      })
    event.preventDefault();
  })

  $('#user-update').submit( function (){
    $.ajax({
      type: 'PUT',
      url: '/user',
      processData: false,
      contentType: false,
      dataType: 'json',
      cache: false,
      data: new FormData(this),
    }).done(function (data) {
      $('#ajax-panel').html('<div class="alert alert-success text-center"> <p> <strong>Success!</strong> ' + data.message || data.statusText || 'Operation Complete' + '<p/> </div>');
      console.log('DONE',data);
    }).fail(function (data){
      $('#ajax-panel').html('<div class="alert alert-danger text-center"> <p>' + data.message || data.statusText || 'Operation Complete' + '<p/> </div>');
      console.log(data.status);
      if (data.status === 404 || data.status ===401) {
        loginAgain()
      }
      console.log('FAIL', data);
    })
    event.preventDefault();
  })


  $('#remove-user-confirm').click(function () {
    $.ajax({
      type: 'DELETE',
      url: '/user',
      cache: false,
      dataType: 'json',
      data: $('#delete-user-form').serialize(),
      beforeSend: function beforeSend() {
        // this is where we append a loading image
        $('#ajax-panel').html('<div class="img-responsive center-block loading"> <img src="/images/loading.gif" alt="Loading..." class="img-responsive center-block loading"/></div>');
      },
    })
      .done(function (data) {
        $('#ajax-panel').html('<div class="alert alert-success text-center"> <p> <strong>Success!</strong> ' + data.message || data.statusText || 'Operation Complete' + '<p/> </div>');
        console.log(data);
      })
      .fail(function (data) {
        $('#ajax-panel').html('<div class="alert alert-danger text-center"> <p>' + data.statusText || 'Internal Server Error' + '<p/> </div>');
        console.log(data);
      });
      event.preventDefault();
  });

  $('#signinButton').click (function(){
    $.post('/user/auth',$("#loginForm").serialize(), function (data){
      if (data.success) {
        $('#loginBad').hide();
        $('#loginOK').html(data.message).show().focus();
        setTimeout(function(){ window.location = data.redirect; }, 2000);
      } else {
        $('#loginBad').html(data.message).show().focus();

        // console.log(data);
      }
    });
    event.preventDefault();
    return;
  });

  $("#registerForm").validate({
      rules: {
      username:{
        required:true,
        minlength: 3,
        maxlength: 40,
        normalizer: function( value ) {
          return $.trim(value);
        }
      },
      email: {
        required:true,
        maxlength: 60,
        email:true,
        normalizer: function( value ) {
          return $.trim(value);
        }
      },
      password1: {
        required:true,
        minlength: 7, // en realidad va 8 , lo pongo en 7 para que de error en si se madna por postman
        lettersonly: false,
      },
      password2: {
        equalTo:'#password1',
        required:true
      },
      legals: {
        required:true
      }
    },
    submitHandler: function(form) {
      $.post('/user',$("#registerForm").serialize(), function (data){
        if(data){
          console.log(data);
          if (data.message.length) {
            var errorList = '<ul>'
            data.message.forEach (function (error) {
              errorList += '<li>'+error+'</li>';
            })
            errorList += '</ul>';
          $('#registerBad').html(errorList).show().focus();
          }else {
            $('#registerBad').hide().focus();
            $('#registerOK').html((data.username.toUpperCase()) + ' ! Your account has been successfully created, please LOGIN').show().focus();
            $('#registerForm').hide();
            setTimeout(function(){ window.location = '/'; }, 2000);
          }
        }
      });
    event.preventDefault();
    return;
    }
  });
});
