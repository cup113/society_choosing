import RequestHandler from "../services/request-handler.mjs";

class IndexHandler extends RequestHandler {
  static method = RequestHandler.GET;
  static path = '/';

  protected async handle_core(): Promise<object | undefined> {
    this.res.redirect('/index.html');
    return;
  }
}

export default RequestHandler.inject(IndexHandler);
