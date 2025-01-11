let validationMessages = {
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

let globalValidators = {
  required: (value, isRequired) => {
    if (typeof value === "boolean") return value
    if (Array.isArray(value)) return !!value.length || validationMessages.required;
    return !!value && !!value.trim() || validationMessages.required;
  },
  minLength: (value, length) => {
    return value.length >= length || validationMessages.minLength.replace('%d', length);
  },
  maxLength: (value, length) => {
    return value.length <= length || validationMessages.maxLength.replace('%d', length);
  },
  minElements: (value, length) => {
    return value.length >= length || validationMessages.minLength.replace('%d', length);
  },
  maxElements: (value, length) => {
    return value.length <= length || validationMessages.maxLength.replace('%d', length);
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
    return Number(value) <= max || validationMessages.maxValue.replace('%d', max);
  },
  minValue: (value, min) => {
    return Number(value) >= min || validationMessages.minValue.replace('%d', min);
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

let isFunction = (v) => typeof v === "function";

let validOptions = {
  validateOn: ["blur", "immediate", "form"],
  validateMode: ["silent", "eager"],
};

let defaultStatus = {
  touched: false,
  dirty: false,
  valid: false,
  optional: false,
  validated: false,
};

export default function useValidation(input) {
    let {
      form = null,
      name = "input",
      value,
      rules = [],
      externalState,
      onUpdate,
      onReset,
      getValue,
      effect,
      validation,
      validateOn,
      validateMode,
    } = input;

    validateOn = validOptions.validateOn.includes(validateOn) ? validateOn : "blur"
    validateMode = validOptions.validateMode.includes(validateMode) ? validateMode : "silent"
    let stateDefaultValue = ""
    let stateValidValue = "valid"
    let stateInvalidValue = "invalid"

    if (!isFunction(onUpdate)) {
      onUpdate = () => {};
    }

    let isOptional = (value) => {
      return (
        !rules.includes("required") &&
        (value === "" ||
          value === false ||
          (Array.isArray(value) && value.length === 0))
      );
    };

    // onUpdate(status, state, messages);

    let validate = (value, event) => {
      let newStatus = {
        touched: validation.status.touched || event === "touch",
        validated: validation.status.validated || event === "formValidate",
        dirty: validation.status.dirty || !!(value && !!value.length),
      };

      let newMessages = {};

      newStatus.valid = rules.reduce((valid, rule) => {
        let [key, v] =
          typeof rule === "string" ? [rule, null] : Object.entries(rule)[0];

        let validator = (isFunction(v) && v) || globalValidators[key];

        if (!validator) return valid;

        newStatus[key] = false;

        let res = validator(value, v);

        if (res === true) {
          newStatus[key] = true;
        } else {
          newMessages[key] = res;
        }

        return valid && newStatus[key];
      }, true);

      newStatus.optional = isOptional(value);

      return { status: newStatus, messages: newMessages }
    };

    let on = (event) => {
      let res = validate(value, event);

      validation.status = res.status
      validation.messages = res.messages
      validation.state = updateState()

      // onUpdate(status, state, messages);
    }

    let updateState = () => {
      let { dirty, touched, validated, optional, valid } = validation.status;

      // external state is set, return it
      if (externalState && externalState.value !== null) {
        return externalState.value;
      }

      // optional input (not required and empty) cannot be valid or invalid,
      // return defalut state
      if (optional) {
        return stateDefaultValue;
      }

      // input has not been yet interacted in any way, return current state
      if (!dirty && !touched && !validated) {
        return validation.state;
      }

      // input is validated manually, return current state
      if (validateOn === "form" && !validated) {
        return validation.state;
      }

      // input is validated on blur, return current state
      if (validateOn === "blur" && !touched && !validated) {
        return validation.state;
      }

      // input is validated immediately, has been touched or validated manually
      // and can change state
      // for invalid inputs always return invalid state
      if (!valid) {
        return stateInvalidValue;
      }

      // for valid inputs return valid only in eager mode or when changing
      // from non default state
      if (
        validateMode === "eager" ||
        validation.state !== stateDefaultValue
      ) {
        return stateValidValue;
      }

      // return default state
      return validation.state;
    };

    let lastValue = value

    effect(() => {
      lastValue = value
      getValue((v) => {
        value = v
        if (value !== lastValue) {
          on("valueUpdate")
        }
      })
    })

    // reset

    let reset = () => {
      validation.status = { ...defaultStatus };
      validation.state = "";
      validation.messages = {};
      isFunction(onReset) && onReset();
      // onUpdate(status, state, messages);
    };

    return {
        form,
        name,
        value,
        touch: () => on("touch"),
        formValidate: () => on("formValidate"),
        reset,
    };
}

document.addEventListener("alpine:init", () => {
  Alpine.store("validation", {
    inputs: {},
  })

  Alpine.directive("validation", (el, {value, expression}, {Alpine, effect, evaluate, evaluateLater}) => {
    let exp = JSON.parse(expression)
    let validateValue = Alpine.$data(el).validateValue
    let name = value ?? Alpine.bound(el, "name") ?? ""
    let getValue = evaluateLater(validateValue)

    Alpine.store("validation").inputs[name] = {
      status: {},
      messages: {},
      state: "",
      getMessages() {
        return this.state !== "" ? this.messages : {}
      }
    }

    let validation = useValidation({
      getValue,
      rules: exp.rules,
      validateOn: exp.validateOn,
      validateMode: exp.validateMode,
      effect,
      validation: Alpine.store("validation").inputs[name]
    })

    Alpine.addScopeToNode(el, {
      touch: validation.touch,
    })
  })

  Alpine.magic("validation", (el, {Alpine}) => input => {
    return Alpine.store("validation").inputs[input]
  })

  Alpine.data("formText", () => {
    return {
      input: "",
      validation: null,

      init() {
        this.$nextTick(() => {
          this.input = Alpine.bound(this.$el, "data-input") ?? this.input
          this.validation = Alpine.store("validation").inputs[this.input]
        })
      },
      getMessages() {
        return this.validation?.state === "invalid" ? this.validation.messages : []
      },
      message: {
        ":class"() {
          let classes = this.$el.attributes
          let c = ""
          if (this.validation.state === "valid") {
            c = classes["class-valid"]?.textContent || ""
          } else if (this.validation.state === "invalid") {
            c = classes["class-invalid"]?.textContent || ""
          }

          return c
        }
      }
    }
  })
})
