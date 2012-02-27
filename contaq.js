jQuery.contaq = function(options) {

  var settings = jQuery.extend({
    subjectText: "Subject",
    emailText: "Email",
    bodyText: "Your message",
    submitText: "Send",
    postUrl: "/post",
    successText: "Success!",
    failureText: "Failure",
    tryAgainText: "Try again",
    waitText: "Please wait..."
  }, options),

  hidden = true,

  validateRegex = function(elem, regex) {
    if(elem.val().match(regex) === null) {
      elem.addClass('with-errors');
      return false;
    }
    else {
      elem.removeClass('with-errors')
      return true;
    }
  }

  validators = {
    email: function(e) {
             var elem = $(this);
             return validateRegex(elem, /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
           },
    subject: function(e) {
             var elem = $(this);
             return validateRegex(elem, /.{3}/);
           },
    body: function(e) {
             var elem = $(this);
             return validateRegex(elem, /.{3}/);
    },
  }

  // Create root element
  rootElement = $(document.createElement("div"))
    .attr("id", "contaq")
    .css({
      position: "absolute",
      top: 100
    }),

  formContainer = $(document.createElement("div"))
    .attr("class", "container")
    .appendTo(rootElement),

  tab = $(document.createElement("div"))
    .addClass("tab")
    .click(function(e) {
      rootElement.animate({
        left: hidden ? 0 : - formContainer.outerWidth()
      }, {
        complete: function() { hidden = !hidden;}
      });
    })
    .appendTo(rootElement),

  // Create form for further usage
  form = $(document.createElement("form"))
    .attr("bla","ble")
    .appendTo(formContainer),

  emailLabel = $(document.createElement("label"))
    .attr("for", "message[email]")
    .appendTo(form)
    .html(settings.emailText),

  emailInput = $(document.createElement("input"))
    .attr("type","text")
    .attr("name", "message[email]")
    .change(validators.email)
    .appendTo(form)

  subjectLabel = $(document.createElement("label"))
    .attr("for", "message[subject]")
    .appendTo(form)
    .html(settings.subjectText),

  subjectInput = $(document.createElement("input"))
    .attr("type","text")
    .attr("name", "message[subject]")
    .change(validators.subject)
    .appendTo(form)

  bodyLabel = $(document.createElement("label"))
    .attr("for", "message[body]")
    .appendTo(form)
    .html(settings.bodyText),

  bodyInput = $(document.createElement("textarea"))
    .attr("name", "message[body]")
    .change(validators.body)
    .appendTo(form),

  submitCallback = function(e) {
    e.preventDefault();
  
    // Refactor:
    emailInput.trigger('change');
    subjectInput.trigger('change');
    bodyInput.trigger('change');

    if(form.children(".with-errors").length > 0)
      return;

    $(this).attr('disabled','disabled')
      .attr('value',settings.waitText);
    $.ajax({
      type: "GET",
      url: settings.postUrl,
      data: form.serialize(),
      dataType: "text",
      success: onSuccess,
      error: onError,
      complete: onComplete
    });
  },

  submitInput = $(document.createElement("input"))
    .attr("type","submit")
    .addClass("submit")
    .attr('value', settings.submitText)
    .bind('click', submitCallback)
    .appendTo(form),
    
  resultElement = $(document.createElement("div"))
    .addClass("result")
    .appendTo(formContainer),

  retryFunction = function() {
    tryAgain.hide();
    resultElement.hide();
    form.show();
  },

  tryAgain =$(document.createElement("button"))
    .addClass("try-again")
    .appendTo(formContainer)
    .html(settings.tryAgainText)
    .bind('click', retryFunction)
    .hide(),

  onSuccess = function() {
    form.hide();
    resultElement.show()
      .html(settings.successText);
  },

  onComplete = function() {
    submitInput.removeAttr('disabled')
      .attr('value',settings.submitText);
  },
  
  onError = function() {
    form.hide();
    resultElement.show()
      .html(settings.failureText);
    tryAgain.show();
  };

  rootElement.css('left', - formContainer.outerWidth());
  rootElement.appendTo(document.body);

};
