// plugins/validation/validators.js
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
    if (typeof value === "boolean") return value || validationMessages.required;
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

// plugins/validation/use-validation.js
function useValidation(input, updateValidation) {
  let {
    name = "input",
    value,
    dirty = false,
    touched = false,
    validated = false,
    stateChanged = false,
    rules = [],
    mode = "blur-silent",
    messages: validationMessages2 = {}
  } = input;
  let [validateOn, validateMode] = [
    "blur-silent",
    "blur-eager",
    "form-silent",
    "form-eager",
    "immediate-eager"
  ].includes(mode) ? mode.split("-") : ["blur", "silent"];
  let isOptional = (value2) => {
    return !rules.includes("required") && (value2 === "" || value2 === false || Array.isArray(value2) && value2.length === 0);
  };
  let validate = (value2) => {
    let status = {};
    let messages = {};
    status.valid = rules.reduce((valid, i) => {
      let [rule, ruleValue] = typeof i === "string" ? [i, null] : Object.entries(i)[0];
      let validator = typeof ruleValue === "function" && ruleValue || globalValidators[rule];
      if (!validator) return valid;
      status[rule] = false;
      let res = validator(value2, ruleValue);
      if (res === true) {
        status[rule] = true;
      } else {
        messages[rule] = validationMessages2[rule]?.replace("%d", ruleValue) || res;
      }
      return valid && status[rule];
    }, true);
    status.optional = isOptional(value2);
    return { status, messages };
  };
  let on = (event, updatedValue) => {
    value = updatedValue !== void 0 ? updatedValue : value;
    let res = validate(value);
    touched = touched || event === "touch";
    validated = validated || event === "formValidate";
    dirty = dirty || !!(value && !!value.length);
    res.status = { ...res.status, touched, validated, dirty };
    res.state = updateState(res.status);
    stateChanged = stateChanged || res.state !== "";
    updateValidation(res);
  };
  let updateState = (status) => {
    let { optional, valid } = status;
    if (optional) {
      return "";
    }
    if (!dirty && !touched && !validated) {
      return "";
    }
    if (validateOn === "form" && !validated) {
      return "";
    }
    if (validateOn === "blur" && !touched && !validated) {
      return "";
    }
    if (!valid) {
      return "invalid";
    }
    if (validateMode === "eager" || stateChanged) {
      return "valid";
    }
    return "";
  };
  let reset = () => {
    dirty = false;
    touched = false;
    validated = false;
    stateChanged = false;
    updateValidation({ status: {}, messages: {}, state: "" });
  };
  return {
    name,
    touch: () => on("touch"),
    formValidate: () => on("formValidate"),
    updateValue: (value2) => on("valueUpdate", value2),
    reset
  };
}

// plugins/validation/validation.js
function validation_default(Alpine) {
  Alpine.data("form", () => {
    return {
      formName: "",
      inputs: {},
      valid: false,
      init() {
        this.formName = Alpine.bound(this.$el, "data-form-name");
      },
      addInput(input) {
        this.inputs[input.name] = input;
      },
      removeInput(input) {
        delete this.inputs[input];
      },
      validateForm() {
        this.valid = true;
        for (let input in this.inputs) {
          this.inputs[input].formValidate();
          let { status } = this.inputs[input];
          this.valid = this.valid && (status.valid || status.optional);
        }
      }
    };
  });
  Alpine.directive(
    "validation",
    (el, { value, expression }, { Alpine: Alpine2, evaluateLater, cleanup }) => {
      let validateValue = Alpine2.$data(el).validateValue;
      if (!validateValue) {
        return;
      }
      let exp = JSON.parse(expression);
      let inputName = value ?? Alpine2.bound(el, "name") ?? "";
      let getValue = evaluateLater(validateValue);
      if (Alpine2.$data(el).formName === void 0) {
        return;
      }
      let validation = useValidation(
        {
          ...exp
        },
        (res) => {
          Alpine2.$data(el).inputs[inputName].status = res.status;
          Alpine2.$data(el).inputs[inputName].messages = res.messages;
          Alpine2.$data(el).inputs[inputName].state = res.state;
        }
      );
      Alpine2.$data(el).addInput({
        name: inputName,
        status: {},
        messages: {},
        state: "",
        formValidate: validation.formValidate,
        reset: validation.reset
      });
      let getter = () => {
        let value2;
        getValue((v) => value2 = v);
        return value2;
      };
      validation.updateValue(getter());
      let watchValue = Alpine2.watch(getter, (value2) => {
        validation.updateValue(value2);
      });
      Alpine2.addScopeToNode(el, {
        touch: validation.touch,
        reset: validation.reset,
        validation: Alpine2.$data(el).inputs[inputName]
      });
      cleanup(watchValue);
      cleanup(() => Alpine2.$data(el).removeInput(inputName));
    }
  );
  Alpine.magic("validation", (el, { Alpine: Alpine2 }) => (input) => {
    return Alpine2.$data(el).inputs[input];
  });
}

// plugins/validation/builds/module.js
var module_default = validation_default;
export {
  module_default as default,
  globalValidators,
  validationMessages
};
