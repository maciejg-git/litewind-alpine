import { globalValidators } from "../../validators";

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

export default function useValidation(inputs, globals) {
  let localInputs = Array.isArray(inputs) ? inputs : [inputs];

  let validation = localInputs.reduce((acc, input) => {
    let {
      form = globals?.form || null,
      name = "input",
      value,
      rules = globals?.rules || [],
      options = globals?.options || {},
      externalState = globals?.externalState,
      onUpdate = globals?.onUpdate,
      onReset = globals?.onReset,
    } = input;

    let status = { ...defaultStatus };

    let state = "";

    let messages = {};

    let opts = {
      validateOn: validOptions.validateOn.includes(options.validateOn)
        ? options.validateOn
        : "blur",
      validateMode: validOptions.validateMode.includes(options.validateMode)
        ? options.validateMode
        : "silent",
      stateDefaultValue: options.stateDefaultValue ?? "",
      stateValidValue: options.stateValidValue ?? "valid",
      stateInvalidValue: options.stateInvalidValue ?? "invalid",
    };

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

    onUpdate(status, state, messages);

    let validate = (value, event) => {
      let newStatus = {
        touched: status.touched || event === "touch",
        validated: status.validated || event === "formValidate",
        dirty: status.dirty || !!(value && !!value.length),
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

      status = res.status
      messages = res.messages
      state = updateState();

      onUpdate(status, state, messages);
    }

    let updateState = () => {
      let { dirty, touched, validated, optional, valid } = status;

      // external state is set, return it
      if (externalState && externalState !== null) {
        return externalState;
      }

      // optional input (not required and empty) cannot be valid or invalid,
      // return defalut state
      if (optional) {
        return opts.stateDefaultValue;
      }

      // input has not been yet interacted in any way, return current state
      if (!dirty && !touched && !validated) {
        return state;
      }

      // input is validated manually, return current state
      if (opts.validateOn === "form" && !validated) {
        return state;
      }

      // input is validated on blur, return current state
      if (opts.validateOn === "blur" && !touched && !validated) {
        return state;
      }

      // input is validated immediately, has been touched or validated manually
      // and can change state
      // for invalid inputs always return invalid state
      if (!valid) {
        return opts.stateInvalidValue;
      }

      // for valid inputs return valid only in eager mode or when changing
      // from non default state
      if (
        opts.validateMode === "eager" ||
        state !== opts.stateDefaultValue
      ) {
        return opts.stateValidValue;
      }

      // return default state
      return state;
    };

    watch(value, () => on("valueUpdate"), { deep: true });

    if (externalState !== undefined) {
      watch(
        externalState,
        () => {
          state.value = updateState();
        },
        { immediate: true }
      );
    }

    // reset

    let reset = () => {
      status = { ...defaultStatus };
      state = "";
      messages = {};
      isFunction(onReset) && onReset();
      onUpdate(status, state, messages);
    };

    return {
      ...acc,
      [name]: {
        form,
        name,
        value,
        status,
        state,
        messages,
        touch: () => on("touch"),
        formValidate: () => on("formValidate"),
        reset,
      },
    };
  }, {});

  // add inputs to form

  Object.values(validation).forEach((i) => {
    isFunction(i.form?.addToForm) && i.form.addToForm(i);
  });

  // return validation for single input

  let i = Object.keys(validation);

  return (i.length === 1) ? validation[i[0]] : validation
}

