(() => {
  // ../validators.js
  var validationMessages = {
    required: "This field is required",
    alpha: "Please enter only letters",
    numeric: "Please enter only numbers",
    alphanumeric: "Please enter only letters or numbers",
    minLength: "Please enter at least %d characters",
    maxLength: "Please enter up to %d characters",
    minElements: "Please select at least %d elements",
    maxElements: "Please select at least %d elements",
    minValue: "",
    maxValue: "",
    email: "Please enter valid email address",
    atLeastOneUppercase: "Please enter at least one uppercase character",
    atLeastOneLowercase: "Please enter at least one lowercase character",
    atLeastOneDigit: "Please enter at least one numeric character",
    atLeastOneSpecial: "Please enter at least one special character",
    sameAs: ""
  };
  var globalValidators = {
    required: (value, isRequired) => {
      if (typeof value === "boolean") return value;
      if (Array.isArray(value)) return !!value.length || validationMessages.required;
      return !!value && !!value.trim() || validationMessages.required;
    },
    minLength: (value, length) => {
      return value.length >= length || validationMessages.minLength.replace("%d", length);
    },
    maxLength: (value, length) => {
      return value.length <= length || validationMessages.maxLength.replace("%d", length);
    },
    minElements: (value, length) => {
      return value.length >= length || validationMessages.minLength.replace("%d", length);
    },
    maxElements: (value, length) => {
      return value.length <= length || validationMessages.maxLength.replace("%d", length);
    },
    alpha: (value) => {
      return /^[a-zA-Z]+$/.test(value) || validationMessages.alpha;
    },
    numeric: (value) => {
      return /^[0-9]+$/.test(value) || validationMessages.numeric;
    },
    alphanumeric: (value) => {
      return /^[a-zA-Z0-9]+$/.test(value) || validationMessages.alphanumeric;
    },
    maxValue: (value, max) => {
      return Number(value) <= max || validationMessages.maxValue.replace("%d", max);
    },
    minValue: (value, min) => {
      return Number(value) >= min || validationMessages.minValue.replace("%d", min);
    },
    email: (value) => {
      return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
        value
      ) || validationMessages.email;
    },
    atLeastOneUppercase: (value) => {
      return /[A-Z]/.test(value) || validationMessages.atLeastOneUppercase;
    },
    atLeastOneLowercase: (value) => {
      return /[a-z]/.test(value) || validationMessages.atLeastOneLowercase;
    },
    atLeastOneSpecial: (value) => {
      return /[^a-zA-Z0-9]/.test(value) || validationMessages.atLeastOneSpecial;
    },
    atLeastOneDigit: (value) => {
      return /[0-9]/.test(value) || validationMessages.atLeastOneDigit;
    },
    sameAs: (value, value2) => {
      return value === value2 || validationMessages.sameAs;
    }
  };

  // ../use-validation.js
  function useValidation(input) {
    let {
      form = null,
      name = "input",
      value,
      rules = [],
      onReset,
      validation,
      validateOn,
      validateMode
    } = input;
    let validOptions = {
      validateOn: ["blur", "immediate", "form"],
      validateMode: ["silent", "eager"]
    };
    let defaultStatus = {
      touched: false,
      dirty: false,
      valid: false,
      optional: false,
      validated: false
    };
    validateOn = validOptions.validateOn.includes(validateOn) ? validateOn : "blur";
    validateMode = validOptions.validateMode.includes(validateMode) ? validateMode : "silent";
    let isOptional = (value2) => {
      return !rules.includes("required") && (value2 === "" || value2 === false || Array.isArray(value2) && value2.length === 0);
    };
    let validate = (value2) => {
      let newStatus = {};
      let newMessages = {};
      newStatus.valid = rules.reduce((valid, rule) => {
        let [key, v] = typeof rule === "string" ? [rule, null] : Object.entries(rule)[0];
        let validator = typeof v === "function" && v || globalValidators[key];
        if (!validator) return valid;
        newStatus[key] = false;
        let res = validator(value2, v);
        if (res === true) {
          newStatus[key] = true;
        } else {
          newMessages[key] = res;
        }
        return valid && newStatus[key];
      }, true);
      newStatus.optional = isOptional(value2);
      return { status: newStatus, messages: newMessages };
    };
    let on = (event, updatedValue) => {
      value = updatedValue !== void 0 ? updatedValue : value;
      let res = validate(value);
      res.status.touched = validation.status.touched || event === "touch";
      res.status.validated = validation.status.validated || event === "formValidate";
      res.status.dirty = validation.status.dirty || !!(value && !!value.length);
      validation.status = res.status;
      validation.messages = res.messages;
      validation.state = updateState();
    };
    let updateState = () => {
      let { dirty, touched, validated, optional, valid } = validation.status;
      if (optional) {
        return "";
      }
      if (!dirty && !touched && !validated) {
        return validation.state;
      }
      if (validateOn === "form" && !validated) {
        return validation.state;
      }
      if (validateOn === "blur" && !touched && !validated) {
        return validation.state;
      }
      if (!valid) {
        return "invalid";
      }
      if (validateMode === "eager" || validation.state !== "") {
        return "valid";
      }
      return validation.state;
    };
    let reset = () => {
      validation.status = { ...defaultStatus };
      validation.state = "";
      validation.messages = {};
      typeof onReset === "function" && onReset();
    };
    return {
      form,
      name,
      value,
      touch: () => on("touch"),
      formValidate: () => on("formValidate"),
      updateValue: (value2) => on("valueUpdate", value2),
      reset
    };
  }

  // ../validation.js
  function validation_default(Alpine2) {
    Alpine2.store("validation", {
      default: {}
    });
    Alpine2.data("form", () => {
      return {
        formName: "",
        init() {
          this.formName = Alpine2.bound(this.$el, "data-form-name");
          Alpine2.store("validation")[this.formName] = {};
        }
      };
    });
    Alpine2.directive("validation", (el, { value, expression }, { Alpine: Alpine3, effect, evaluate, evaluateLater, cleanup }) => {
      let exp = JSON.parse(expression);
      let inputName = value ?? Alpine3.bound(el, "name") ?? "";
      let formName = Alpine3.$data(el).formName ?? "default";
      let validateValue = Alpine3.$data(el).validateValue;
      let getValue = evaluateLater(validateValue);
      Alpine3.store("validation")[formName][inputName] = {
        status: {},
        messages: {},
        state: ""
      };
      let validation = useValidation({
        ...exp,
        validation: Alpine3.store("validation")[formName][inputName]
      });
      let getter = () => {
        let value2;
        getValue((v) => value2 = v);
        return value2;
      };
      validation.updateValue(getter());
      let watchValue = Alpine3.watch(getter, (value2) => {
        validation.updateValue(value2);
      });
      Alpine3.addScopeToNode(el, {
        touch: validation.touch,
        validation: Alpine3.store("validation")[formName][inputName]
      });
      cleanup(watchValue);
    });
    Alpine2.magic("validation", (el, { Alpine: Alpine3 }) => (form, input) => {
      return Alpine3.store("validation")[form][input];
    });
  }

  // cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(validation_default);
  });
})();
