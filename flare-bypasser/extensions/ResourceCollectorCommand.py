from flare_bypasser import BaseCommandProcessor, Request, Response, BrowserWrapper
import zendriver_flare_bypasser as zendriver


class ResourceCollectorCommand(BaseCommandProcessor):
  async def preprocess_command(self, req: Request, driver: BrowserWrapper) -> Request:
    return req


  async def process_command(self, res: Response, req: Request, driver: BrowserWrapper) -> Response:
    nodriver_tab: zendriver.Tab = driver.get_driver()

    res.response = {
        "dom": await nodriver_tab.get_content(),
	"content_urls": await nodriver_tab.get_all_urls()
    }

    return res


def get_user_commands():
    return {
        "collect-resources": ResourceCollectorCommand()
    }
