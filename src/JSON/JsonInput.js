import { TextInput } from 'react-admin';
import React, { Component } from "react";

const DEFAULT_ERRORTEXT = 'Invalid JSON';

const parseFunction = (json) => {
  let retval = json;
  try {retval= JSON.parse(json);}
  catch (e){}
  finally { return retval;}
}

const parseJSON = (json) => {
  let retval = false;
  try {if (typeof JSON.parse(json) === 'object') retval = true;}
  catch (e){}
  finally {return retval;}
}
class JsonInput extends Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    const {validate = [],errortext = DEFAULT_ERRORTEXT,resettable,multiline = true,parse=true, ...rest} = this.props;
    const errorobj = {message: errortext};

    const validateJSON = (value) => {
      if (!value || typeof value === 'object') 
        return undefined;
      const valid = parseJSON(value);
      return valid ? undefined : errorobj;
    }

    const formatJSON = (json) => {
      let retval = json;
      if (retval && typeof retval === 'object') 
        retval = JSON.stringify(retval);
      return retval;
    };

    validate.push(validateJSON);
    rest.validate = validate;
    rest.format = formatJSON;
    if (parse) rest.parse = parseFunction;
    if (multiline) rest.multiline = true;
    return (
        <TextInput {...rest} />
    );
  }
}

export {JsonInput};
