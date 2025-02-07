import { globalValidators } from "./validators.js"

export default function useValidation(input) {
    let {
      form = null,
      name = "input",
      value,
      rules = [],
      onReset,
      validation,
      validateOn,
      validateMode,
    } = input;

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

    validateOn = validOptions.validateOn.includes(validateOn) ? validateOn : "blur"
    validateMode = validOptions.validateMode.includes(validateMode) ? validateMode : "silent"

    let isOptional = (value) => {
      return (
        !rules.includes("required") &&
        (value === "" ||
          value === false ||
          (Array.isArray(value) && value.length === 0))
      );
    };

    let validate = (value) => {
      let newStatus = {}
      let newMessages = {};

      newStatus.valid = rules.reduce((valid, rule) => {
        let [key, v] =
          typeof rule === "string" ? [rule, null] : Object.entries(rule)[0];

        let validator = (typeof v === "function" && v) || globalValidators[key];

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

    let on = (event, updatedValue) => {
      value = updatedValue !== undefined ? updatedValue : value
      let res = validate(value);

      res.status.touched = validation.status.touched || event === "touch"
      res.status.validated = validation.status.validated || event === "formValidate"
      res.status.dirty = validation.status.dirty || !!(value && !!value.length)

      validation.status = res.status
      validation.messages = res.messages
      validation.state = updateState()
    }

    let updateState = () => {
      let { dirty, touched, validated, optional, valid } = validation.status;

      // optional input (not required and empty) cannot be valid or invalid,
      // return defalut state
      if (optional) {
        return "";
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
        return "invalid";
      }

      // for valid inputs return valid only in eager mode or when changing
      // from non default state
      if (
        validateMode === "eager" ||
        validation.state !== ""
      ) {
        return "valid";
      }

      // return default state
      return validation.state;
    };

    // reset

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
        updateValue: (value) => on("valueUpdate", value),
        reset,
    };
}
