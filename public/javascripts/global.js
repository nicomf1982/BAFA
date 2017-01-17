$(document).ready( function() {// Esta parte del código se ejecutará  cuando la página esté lista.

  // prevengo el defaul de ahcer click en el boton de Login

  'use strict';

  $('#loginBtn').click(function(){
    event.preventDefault();
    return;
  });

  $('[data-toggle="tooltip"]').tooltip();

  // Metodo para el evento Modal desde Javascrip , boostrap los hace directamente usando los tags de button
  // $('#loginBtn').click(function(){
  //   $('#myModal').modal('show');
  //   event.preventDefault();
  //   return;
  // });

  $('#signinButton').click (function(){
    $.post('/login',$("#loginForm").serialize(), function (data){
      if (data.status) {
        $('#loginBad').hide();
        $('#loginOK').html(data.message).show().focus();
        setTimeout(function(){ window.location = '/'; }, 1000);
      }else {
        $('#loginBad').html(data.message).show().focus();
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
      $.post('/register',$("#registerForm").serialize(), function (data){
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
