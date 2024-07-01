import { AxiosError } from "axios";
import { ResponseErrors } from "../types/global";
import _ from "lodash";
import * as Sentry from "@sentry/browser";
import Fetch from "./Fetch";

class ErrorHandler {
  error: Error;
  constructor(error: Error) {
    this.error = error;
  }

  isAxiosError = (): boolean => {
    // @ts-ignore
    return this.error.isAxiosError;
  };

  getMessages = (): string[] => {
    if (!this.isAxiosError()) {
      return [this.error.message];
    }

    const error = (this.error as unknown) as AxiosError<ResponseErrors>;
    if (!error.response) {
      return [error.message];
    }
    const { message } = error.response.data;

    if (message) {
      return [message];
    }

    return [];
  };

  getFieldsErrorMessages = (): Record<string, string[]> => {
    if (!this.isAxiosError()) {
      return {};
    }

    const error = (this.error as unknown) as AxiosError<ResponseErrors>;

    if (!error.response) return {};

    const errors = error.response.data.errors;
    const output: Record<string, string[]> = {};
    if (Array.isArray(errors)) {
      errors.forEach((e) => {
        if (!output[e.field]) output[e.field] = [];
        output[e.field].push(e.message);
      });
    }

    return output;
  };

  getAllMessages = () => {
    const defaultMessages = this.getMessages();
    const fieldMessages = this.getFieldsErrorMessages();

    const fieldMessagesFlatten = _.flatten(Object.values(fieldMessages));

    return [...defaultMessages, ...fieldMessagesFlatten];
  };

  getAllMessagesString = () => {
    return this.getAllMessages().join("\n");
  };
}

const errorHandler = (error: Error) => new ErrorHandler(error);

export const showMessageError = (error: any) => {
  if (!error) {
    return;
  }
  const handler = errorHandler(error);
  Sentry.configureScope((scope) => {
    scope.setTag(`error`, handler.isAxiosError());
    // scope.setTag(
    //   "release",
    //   process.env.APP_VERSION || global.config.NEXT_PUBLIC_APP_VERSION
    // );
    scope.setExtra(`url`, global.ctx?.pathname || window.location.href);
    scope.setExtra(`query`, global.ctx?.query || window.location.search);
    if (Fetch?.me) {
      scope.setUser({
        id: Fetch?.me?.id + "",
        name: Fetch?.me?.name,
        email: Fetch?.me?.email,
      });
    }
  });
  if (error.response) {
    const msg = Sentry.captureMessage(
      error?.response?.data?.errors?.toString?.() ||
        error?.response?.data?.message ||
        ""
    );
    console.log("error", msg);
  } else {
    Sentry.captureException(error);
    console.log("error");
  }
  if (!handler.isAxiosError()) {
    const mess = handler.getMessages().join("\n");
    if (!mess) return;
    // global.showMessage(mess);
    return;
  }

  const anyError = (error as unknown) as AxiosError<ResponseErrors>;

  if (!anyError.response) return;

  let mess = anyError?.response?.data?.message;
  const err = anyError?.response?.data?.errors;
  if (mess?.includes("Request")) {
    mess = "";
  }

  if (!mess && err) {
    mess = err[0]?.message;
  }

  if (!mess) return;
  // global.showMessage(mess);
};

export default errorHandler;
