	/**
	 * 	@version 0.9
	 * 	@author Scott van Looy
	 *	Generic validator. Pass in an object consisting of an array of {field, valObject} form field and a validation object:
	 *	@param {Object} obj: Validation object with the following properties:
     *	@param {Integer} min (Optional) include this for a minimum character limit test
     *	@param {Integer} max (Optional) include this for a maximum character limit test
     *	@param {Boolean} mandatory (Optional) include this if the form field is mandatory
     *	@param {Boolean} tel (Optional) tests for a phone number
     *	@param {Boolean} email (Optional) tests for an email address
     *	@param {Boolean} url (Optional) tests for a URL with or without resource type (http(s))
     *	@param {Boolean} fullUrl (Optional) tests for a URL with resource type (http(s))
     *	@param {Boolean} numeric (Optional) tests that the field is a number
     *	@param {String} minText: (Mandatory if "min" test used) The error message you wish to display if you use the minimum character limit test
     *	@param {String} maxText: (Mandatory if "max" test used) The error message you wish to display if you use the maximum character limit test
     *	@param {String} mandatoryText: (Mandatory if "mandatory" test used) The error message you wish to display if you use the mandatory field test
     *	@param {String} telText: (Mandatory if "tel" test used) The error message you wish to display if you use the phone number test
     *	@param {String} emailText: (Mandatory if "email" test used) The error message you wish to display if you use the email test
     *	@param {String} urlText: (Mandatory if "url" test used) The error message you wish to display if you use the url test
     *	@param {String} fullUrlText: (Mandatory if "fullUrl" test used) The error message you wish to display if you use the full url test
     *	@param {String} numericText: (Mandatory if "numeric" test used) The error message you wish to display if you use the numeric test
     *	@return An array containing all the errors in error objects along with the associated form fields
     *	@type {Object}
     *	@param {Object} field: The form field DOM reference.
     *	@param {String} errorText: The returned error text for that form field.
     *	If there are no errors, an array is returned, the first member of which is an object with a single property, noerrors which is set to true.
     *	
     */
	var SJ = SJ || {}
       SJ.validate = function(obj){
            var returnObj=new Array();
            var err=0;
			/**
			 * Library of common types of form validation
			 * @param {Object} value - the numeric value in the case of max/min or boolean "true" in most other cases for testing against.
			 * @param {Object} term - the form field value to be tested
			 */
            var checkLib = {
                max: function(value,term){
                    value=parseInt(value);
                    SJ.log('max',value,term,' return value: '+(term.length<=value))
                    return(term.length<=value)
                },
                min:function(value,term){
                    value=parseInt(value);
                    SJ.log(term.length,'term length')
                    SJ.log('min',value,term,' return value: '+(term.length>=value))
                    return(term.length>=value)
                },
                mandatory:function(value,term){
                    SJ.log('mandatory',value,' return value: '+((term == true) || (term.length>0)))
                    return ((term == true) || (term != true && term.length>0))
                },
                tel:function(value,term){
                    var regexp = /^[0-9 +()-]+$/;
                    return regexp.test(value);
                },
                email:function(value,term){
                    var regexp = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                    return regexp.test(value);
                },
                url:function(value,term){
                    var regexp = /^(https?:\/\/)?(\w+:{0,1}\w*@)?([a-z0-9-\.]+\.)?([a-z0-9-]{2,})\.([a-z]{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]+))?$/;
                    return regexp.test(value);
                },
                fullUrl:function(value,term){
                    //http(s):// is mandatory
                    var regexp = /^(https?:\/\/)(\w+:{0,1}\w*@)?([a-z0-9-\.]+\.)?([a-z0-9-]{2,})\.([a-z]{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]+))?$/;
                    return regexp.test(value);
                },
                numeric:function(value,term){
                    var regexp = /[0-9]+$/;
                    return regexp.test(value);
                }
            }
            var typeLib = {
                checkbox:function(obj){
                    SJ.log('checkbox: ',obj.checked)
                    return obj.checked
                },
                text:function(obj){
                    SJ.log('text: ',obj.value)
                    return obj.value
                }
            }
			var l=obj.length
            while(l--){
                for (var n in checkLib) {
                    if(obj[l].valObj[n]){
                        SJ.log("-------- iteration "+l+ ' sub '+n+', check type '+n,' field type: ',obj[l].field.type,' Typelib is returning: ',typeLib[obj[l].field.type](obj[l].field))
                        if (!checkLib[n](obj[l].valObj[n], typeLib[obj[l].field.type](obj[l].field))) {
                            returnObj[err] = {
                                field:obj[l].field,
                                errorText:obj[l].valObj[n+'Text']
                                }
                            err++;
                            SJ.log(obj[l].valObj[n+'Text'])
                            SJ.log("-------- iteration "+l+ ' sub '+n+' errored');
                        }
                    }
                }
            }
            if (typeof returnObj[0] === "undefined"){
                returnObj[0] = {
                    noerrors: true
                };
            }
            return returnObj;
        }
	SJ.log = function(l){
		if(typeof console !== "undefined" && console.log){
			console.log(l);
		}
	}
