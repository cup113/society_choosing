import RequestHandler from "../services/request-handler.mjs";

class HistoryRouter extends RequestHandler {
  static method = RequestHandler.GET;
  static path = "/";

  public async handle_core(): Promise<object | undefined> {
    await this.authorize();
    const items = (await this.check_response(this.databaseService.list_choices())).choices;
    return {
      totalItems: items.length,
      items,
    };
  }
}

export default RequestHandler.inject(HistoryRouter);
