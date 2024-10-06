import json
import socket
from datetime import datetime
from typing import Optional, TypedDict, Literal

from confluent_kafka import Producer
from neomodel import config
from playwright.async_api import async_playwright

from shared.accessors import find_or_create_node
from shared.models.artifact import Artifact
from shared.models.platform import Platform
from shared.models.scrapper import Scrapper
from shared.models.url import create_url_node
from shared.utils.errors import exception_to_json
from shared.utils.url_utils import construct_absolute_url


class SetCookieParam(TypedDict, total=False):
    name: str
    value: str
    url: Optional[str]
    domain: Optional[str]
    path: Optional[str]
    expires: Optional[float]
    httpOnly: Optional[bool]
    secure: Optional[bool]
    sameSite: Optional[Literal["Lax", "None", "Strict"]]


def transform_cookie_data(cookie_data):
    result = []
    for cookie in cookie_data:
        same_site_mapping = {
            'unspecified': None,
            'lax': "Lax",
            'strict': "Strict",
            'none': "None",
            'no_restriction': None
        }

        transformed_cookie = SetCookieParam(
            name=cookie.get("name"),
            value=cookie.get("value"),
            domain=cookie.get("domain"),
            path=cookie.get("path"),
            expires=cookie.get("expirationDate"),
            httpOnly=cookie.get("httpOnly"),
            secure=cookie.get("secure"),
            sameSite=same_site_mapping.get(cookie.get("sameSite").lower(), None)
        )

        result.append(transformed_cookie)
    return result


class BaseAdapter:

    def __init__(self, neo4j_config, kafka_config):
        self.neo4j_config = neo4j_config
        config.DATABASE_URL = f'bolt://{neo4j_config["user"]}:{neo4j_config["password"]}@{neo4j_config["host"]}:{neo4j_config["port"]}'
        config.DATABASE_NAME = "neo4j"

        self.kafka_config = kafka_config
        if kafka_config.get('user'):
            self.kafka_producer = Producer({
                'bootstrap.servers': kafka_config.get("servers"),
                'sasl.username': kafka_config.get("user"),
                'sasl.password': kafka_config.get("password"),

                'security.protocol': 'PLAINTEXT',
            })

        else:
            self.kafka_producer = Producer({
                'bootstrap.servers': kafka_config.get("servers"),
                'client.id': socket.gethostname(),

                'security.protocol': 'PLAINTEXT',
            })

    async def scrape(self, task_id, configuration):
        try:
            async with async_playwright() as p:
                self.publish_to_kafka(self.kafka_config.get("topik"), "update_task", {
                    "task_id": task_id,
                    "status": "PROCESSING",
                })

                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context()
                await context.add_cookies(transform_cookie_data([
                    {
                        "domain": ".viator.com",
                        "expirationDate": 1753468505.705937,
                        "hostOnly": False,
                        "httpOnly": False,
                        "name": "_ga",
                        "path": "/",
                        "sameSite": "unspecified",
                        "secure": False,
                        "session": False,
                        "storeId": "0",
                        "value": "GA1.1.1110285738.1718908506"
                    },
                    {
                        "domain": ".viator.com",
                        "expirationDate": 1753468507.066668,
                        "hostOnly": False,
                        "httpOnly": False,
                        "name": "_ga_JQ3HF8G8ZR",
                        "path": "/",
                        "sameSite": "unspecified",
                        "secure": False,
                        "session": False,
                        "storeId": "0",
                        "value": "GS1.1.1718908505.1.0.1718908507.58.0.0"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1762772633.024949,
                        "hostOnly": True,
                        "httpOnly": True,
                        "name": "x-viator-tapersistentcookie",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "32283f5c-cecb-46a0-9ec0-f2fd1bb63e8e"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1756516496.58134,
                        "hostOnly": True,
                        "httpOnly": True,
                        "name": "x-viator-tapersistentcookie-xs",
                        "path": "/",
                        "sameSite": "no_restriction",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "32283f5c-cecb-46a0-9ec0-f2fd1bb63e8e"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1759755833,
                        "hostOnly": True,
                        "httpOnly": False,
                        "name": "_cc",
                        "path": "/",
                        "sameSite": "no_restriction",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "AQP5PsEPA9VSGRhylc8a8Z%2FZ"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1759755833,
                        "hostOnly": True,
                        "httpOnly": False,
                        "name": "_cid_cc",
                        "path": "/",
                        "sameSite": "no_restriction",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "AQP5PsEPA9VSGRhylc8a8Z%2FZ"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1762772629.785448,
                        "hostOnly": True,
                        "httpOnly": False,
                        "name": "ORION_WISHLIST_INTERACTED",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": False,
                        "session": False,
                        "storeId": "0",
                        "value": ""
                    },
                    {
                        "domain": ".www.viator.com",
                        "expirationDate": 1740685230,
                        "hostOnly": False,
                        "httpOnly": False,
                        "name": "g_state",
                        "path": "/",
                        "sameSite": "unspecified",
                        "secure": False,
                        "session": False,
                        "storeId": "0",
                        "value": "{\"i_t\":1725219630345,\"i_l\":0}"
                    },
                    {
                        "domain": "www.viator.com",
                        "hostOnly": True,
                        "httpOnly": False,
                        "name": "XSRF-TOKEN",
                        "path": "/",
                        "sameSite": "unspecified",
                        "secure": True,
                        "session": True,
                        "storeId": "0",
                        "value": "69bc3f35-f3c0-4212-a2d0-95203e300f25"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1728771952.013789,
                        "hostOnly": True,
                        "httpOnly": True,
                        "name": "SEM_PARAMS",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "%7B%7D"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1728771952.013866,
                        "hostOnly": True,
                        "httpOnly": True,
                        "name": "SEM_MCID",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "42384"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1728771952.013924,
                        "hostOnly": True,
                        "httpOnly": True,
                        "name": "EXTERNAL_SESSION_ID",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": ""
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1728817428.942417,
                        "hostOnly": True,
                        "httpOnly": True,
                        "name": "LAST_TOUCH_SEM_MCID",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "42384"
                    },
                    {
                        "domain": ".viator.com",
                        "expirationDate": 1735943156,
                        "hostOnly": False,
                        "httpOnly": False,
                        "name": "_gcl_au",
                        "path": "/",
                        "sameSite": "unspecified",
                        "secure": False,
                        "session": False,
                        "storeId": "0",
                        "value": "1.1.411758914.1728167156"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1759745819.42668,
                        "hostOnly": True,
                        "httpOnly": True,
                        "name": "ORION_AUTHORISATION",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "vysEX0V9ubLRQZivOVffUA%253D%253D%257Cl8eTan%252BIJLJHnmtggfFDms%252BR3ufBOoOkGuUylG%252BOlXdhwaGwWStPcpcHWv60GkFj0sF4P8F3mu4gDzG5AxjaNS1nhFbh%252Br3C89b2Ym7PChvoFcTP08%252Bkaq1gENyifGdwV6wQSC17kmWrlrDKhGH%252Bg1YbgpdWEy0L1nkev6VkHf69oaXp%252BG3alUrrAB8C7MlnjJ%252B7i1t8rG1uBEsFU1Mv24PMi3eDDGLYrXQj4W4%252FFVzDbw4m5yXuw8JbyHsabKVZOX4EgAd5uwG7Xz%252F7RYtZqW8LEXDPqBByIJxzKnyGVS6X2tMt5bZHVfrrpWI%252FXLNQw3vu4NpoLJJhBuen%252FSJ8%252Bhnj0%252B%252FmwNqvNMe3BkVPnueIQuYo2WhOGWlC8sj3oevpgQKATV8hQvrbe5OTakRaW%252F%252Bpmd9Rs8IzVz8p8SSuCtySjzxmcU8DNR5hfG%252BgQDjycOmK2FrqdsfE%252BuBc9%252BM7PFlN5yoOrb%252BYyX%252BPSknohufPfw%252BSGPFnRnFhbadpeC5LzFzfdMUb%252BfhgqysIcHvmehst58KU%252BDvaFihUV3GIyIltMNNE4ZVDaofjdh394eR7cpfLfc1%252BrRi1ArPkiXrWprNoIsJsWWur55n4QhscR7hZ9ivavbC4l8LUnGb%252BmbEaB7cb2rRiQ1Pnm5WRtboNHxz9HbXhaBAMhU53pEu%252B97rJn8FhwWN5Zb7T1lCiI%252FDvIVk7Ng5xEwd17frcc40PDkQ5JLcYNaxioOHtpIQK4L%252BkPBN4Pc%252Fwfo2C0RJfcidLcvRh2BX8zS1%252BjNodX%252FHwt7ohU8ah3MNC1yUsBmUkaLcNdbFLEodMx41wbqspfD7wU1CihNW9qswxS%252FGofYF9GlEcjubTJYyb7EhtjerODKFnrueBIG28BRXwrifahybmpLj4ZeRPGsMro6MiIfAp3%252FNA5YRC7g85JuV%252BL%252B1NhdnRDS%252B274XHKMc6QYIr1dGm2459h6tSCYRjpET3wnIQDHxdN4X1rBGQmv78WMtIDbWYxx%252FTQFmjNptQ8HriUPUKbM5vclLO1KFs5qrXUoOkSh8p91JRHR3fPob%252Bb5woIGyWfmanL2ytgPY%252FU7RdWclFjZA8YD0hr%252FhXJxo6RAh6DpYLBNjCpvvhocDL%252B1XoiQ53loNjut6UScr3QF2BMjK8EIJbf3%252BwwGxuNJlmRBRXimpeZjrMU%252BiUU%252FR5jBlG%252FWcQXtuuxbxDL6W2zCPomosELPdQGD3m9RnFcMcIS4r9l%252B%252F08Rn9wTT9ksiX3jyObfPAKIf%252FHHJYaoCj4JrjAzOYarAFqOJ3JTkU21xwNc%252BSSBGI9L5oVAw0yc12%252BhVUptDIIBRLmZpWpEQNItQsjBa55lRWJp67Xxynb5gKHm0pZ4S902%252BphhbOspJqCAIUc1djoO0YL1yPv95G6N7zK2qHIA114eyIA2W1FGKruCO20GakT9I2ud0Mjs%252BS8oEM6o5TdyZRel3084MRcySPXoDHp3yZY%252FlXvOVmmXcngVdToms2y5qwhAH5HgsO8Dcp1uXvOZx5ze%252FdbU7pLwAFEkXbmS9lRV0Cvb8Qo5pivQeq6WIMapE6Z8k7uxNs62n%252F8R6dA8cRHP6sCruP0iq%252FdwkJ7AwwLmus5B0WRCxrR1r%252FidhzIk4LK%252F4vI%252Fp2xvCgGQmrF%252F%252FwvuAKjHrE%252BKWctJB3tMDBORqQMSzOCueqivIJauxRW1h3JZTuV4XMXoTSY0Hows3%252BMWne4UwVFbjlAXqtH1cZ9bBF8ss2orYoXACM6HRhIQmfP7MhZ32WtvY%252BVDWoJrTMPbqcwVeZczUiq%252FOkunmuEh0sPU7y3OvmlWRWvaIYKVkOx1ZecBVcRdw5qXLe6f4n1Ge9gXh4FEHtprPa%252BF8mky7FEt97cbr2WifCeuYQr7Wr2MIg8sfmnbJ%252BwrjKE3k0Sh0AXbG40mC8hoHCPR%252BZcfdoNkwIIPhsDSZUH4cW3jiBBqO0gFU83Dvjaa5LAwj6Foo5vWetP0D59pHD01ZCnNjgDFeRCntMCVfRhVhVthgN9HPEA6ERorheR%252FcLNpFMrrQ3xvoWymFCJ8wOeDiZFE5x1EBlMsnsM2pgJ4WZI22NznXVvGNSyCrj2icEI5pdiw4A8SXAxU2lb7k7JLQnseq22a%252FgqLU5pj4rbzPqWHmQdimNZg2TlOuWmC7WB%252BtyA5niFxXQwW5R5tHLcDhPL%252B6GHkGmmGdiI8XWRhmsiEvQvXH4lEacMGNc7%252B%252BRfM%252FsxLxuI%252FTTHfvyzxgPwg0dCEbCSHZbQvf3BSZ7pn1MHC2zoSKv3VlmhBydMSJ7bwL3nkebBT1%252F9OpoLV61MC0BtTkdrhTUP5v9k6cBl9UlT1W79YznO4%252Bnlj4%253D%257CeQ8ATo5zAhE%253D%253AjsBzKP5HLxPSsCONtM01hUYCbgb23CUqS08OlaJJpmw%253D"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1762772630.589536,
                        "hostOnly": True,
                        "httpOnly": False,
                        "name": "ORION_FIREBASE_AUTH",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "%7B%22firebaseIdToken%22%3A%22eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkNzU2OWQyODJkNWM1Mzk5MmNiYWZjZWI2NjBlYmQ0Y2E1OTMxM2EiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTWlraGFpbCBEb3Jva2hvdmljaCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJTlY2MDdoY3RrZkJ4MGZpTm14SmV2RkhJZjNiYzRqd20zRDZxaTFOazc9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXBpLXByb2plY3QtNTE4ODY1ODUzNzk2IiwiYXVkIjoiYXBpLXByb2plY3QtNTE4ODY1ODUzNzk2IiwiYXV0aF90aW1lIjoxNzI1NTcyNjg0LCJ1c2VyX2lkIjoicXo5emVqeTU4ZWFZOTZUWm1ZZ2lGcDhYWkM4MyIsInN1YiI6InF6OXplank1OGVhWTk2VFptWWdpRnA4WFpDODMiLCJpYXQiOjE3MjgyMDk4MjEsImV4cCI6MTcyODIxMzQyMSwiZW1haWwiOiJtaWtoYWlsQGRvcm9raG92aWNoLnJ1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTA1MDMyMDA4NjU2MjY4OTUwMzIiXSwiZW1haWwiOlsibWlraGFpbEBkb3Jva2hvdmljaC5ydSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.s0R9gKOf7j0U96whuzFL21S4nBKTKqTmWjruk6PbmuBH2acQyW9G_QU_06kseoEa6svP4sgSEBktN4wTeXXtNxx2rG9E13AOK_XTMxawxpcXb3pw0jPKu8DNdN_Dy-vWzninaIMN08RmhG-KhPgslJPyQjl_g0HuJZVUAE1cMxJQYhRMd9kbzPmPj2Xr9yaK81lYZutl2ValI-D30_I_NfQx2vrRr9vNhZ7eLCbBHY2e_k_kx5J0a9PuMGLQEhZ-c3S4gW31mLE6wr80w0mlVmIN1TELwLikmSCddhBB-TmiaM83b-wXNboe2DeCXT9HOSnCDjfcfzY-fxk8STnQlg%22%2C%22firebaseRefreshToken%22%3A%22AMf-vBzNBKfeMlCimTuMK-7zZ0fe3HLsEmzCm-rhuJ_NyNzjwGq6JwSFiGYWRSVwSmDs_0S4KzTVm26qdRqsG6xUUoVzP6Sh6iupaSz_Px565jTyAkgc9WGn3_DX3avuU0YWZri4EOvYf5aXaRpt3xbWKYmKdHYo_wuMY_KqgicbkGyTte14nhHaoh2RyiPHX2mv3AgkDR8r4ijfjquqr41IS5xKzR5pqmaqVMM0sCxJNxbJVlNoWJ6bxoqvkPI7Db7J1nIRh9TYybrjkZYif7OsGs0hSyb3AmOKMTfyPsqlU9oKuYn8JXdkjyP67ttkiZs_Pspe-KqhwVw5qXNSGN0DHi7zqYCR_q6cKJqBTp1GrqASwbY36kX6l7ELaMlPjtWPRcqU5dnFMhJUtqQntN62dSe9SUf-TmgbPk8nbpS-Yy0j6SG6fvpChVPS-tgB3SyRuXUxYLW3oO7LUMuKMD6a_yEYOivJ1w%22%2C%22firebaseAuthExpiry%22%3A%222024-10-06T11%3A17%3A01.000Z%22%7D"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1762772628.942466,
                        "hostOnly": True,
                        "httpOnly": True,
                        "name": "ORION_SESSION",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "p9vtEZccD88UdDltzzIORg%3D%3D%7CzWuw4b4QARI%2BQBj4RPqqNUMvQfvCexYU5VmlPX%2FYGahGw2GGXSwYCwm7tXEOUXf8bEOQgoMDIoJG6YeyvpRHBMGTsvBXLjtd1MN54iwpwftk32IY7UoVEnvkP5zriDU0hEk8O0Q6Xjx7ufLfUIyvg7b%2FokDm4qxCiEFs%2BZlBQ8GwtDAg%2FZyAoGNrKmbq3e1K1RL2%2B%2FRBFNe386314ouRfFUIdgH1j0aSV%2BVsVVBBpEEHwydPD5m7twZK3EwDF7annlaLrwnFBRV5vun38Xd7isBoKyNXQb60QrynE2I%2FWydxEc5ho8IAWREnCsEGY%2BikQzhEJr3rsljMuetCp5QXuFGvgYAiuBhzxc6izM7bIshQw68v6fBEH7km9lfN9rPyWx45o6TWk8kpWrrctCD4tYKB2dZR2RaquwzhsU9wgRnlkofwU0PrNYPccco389J7spME6ls4JN1G8ySJykx%2BdnqWK8f%2FsPqZyCOZn6r9BNJti88OfRyScmqx5Wy5FBVGwPnLwPnfNQ7VslStTVNWlp%2FcNiCha9kCSXNjhxdcLelzggsytNiG870v3KKYrQtldQO%2FRcldZFIbXEZRBFDpZmv4u%2F%2BEGEy3b%2FyJxph35Uh2Ts7Dl8kqHJN6D%2BR6erG7w51M0nFEgNI4r3S9k%2F1j%2FKRd3r9tBiiuiD9ia%2BN5GcU5hmk70SeV4a5upmLXqGuzrHGm%2FcSJmptEfqIHKYkeqruYJd8Zc5%2FoDOCID6fKL11f99xVRx9fZu9sRXG7jpZauP6jPwFPAIRHL3cJrIZQlF1sud66L3rUlQr3s9wCXS0Hmf3QGY5IFJgLXVgBgHgdMaoca0oqgj99E79g5xE2iEVqExBDEmT31ttr7ku8cyLojrxdkkR8WeRuoXmM5VxdyxVeMLue3%2FmAeRzi7QLcAjkzgcVT6EtJKrBCj1bpNlALbaFvBpq5gRrbJu7OZOlAgu%2BI8MSkrnclbqbX0mzTOH%2BJrvHHfugDlbDA6g78iIdyfUim5vDxu7aJmp87Xjf1lBxzt756dHZVb%2Bo4eSCPFtQlUy2%2B%2BcgWPKugMVckZe3i9QGxzkRDk%2BML5j5lySTrHKr6WxpRQe9aED5HnL812Ii52OUA%2FtdzbrtdNBZRG9pL5%2F3tOloE%2BMsQxZba7CjEnCZGuw8Afgiw3vW5H51uXlQukiESVGm8%2FJ9ELuTthHGX32wi%2FFBSrwRArZa2zKQliotlEmXHBc2sMahtPW566IUvjOlLxqRHi3QX5fAkzZPzYuOZDc8XG7aVHZJ0wXf5N6rPuCPXh0Yqwne9sxWIQqBsPpiuGV6%2FiAZs78Phz68CZYOwRMIq7rE740%2FVaCUoV38RMQz0uXnzsMufDVSqZhG5HcY4xpczoU9CdfiNIqc%2FQaM01uvVjcgrLVskNtwTz8q9rg8LYxlAt3N0GY53WAk4G7qeulO4%2BL8hbjB3Cc2IRYvzE3gBHEXTliLbQA7%2BCkOfe8DcLxJej6af3cV%2Fieba5YqoN%2F2w7MOne1WXKxxBn6uK8ANganTcCVXPSYMzxHOIZ1vArB5XLEfld6CBgBG02MIpckUoJ0XUxSf4Qozh%2FlCYpjCtbzmfwPzd0kX3cQI0kR2Tp95lUIjI2aSwH0o7I8oQw9kAid1CDHOSKlGCk0c5XIwAgnSPrWoZ3%2FulWjIevIbaidE9lSYURnStwiaqbtgQkI5AcPkm%2BPPXuWjLme%2FqU%2FyaMKZpWk9OPOojnRoD9sJ3t5ZeQyQbhWU0kosKOjh47rIo6xbaXDf1m3JBMN4kDUAJKN1frMBdrI0QFJJ26k%2BPiKj7pPKpT5LsJ9z6yKuXcfgyNYRKl2otzOWCYQdN0b%2FSDiWVVo%2FFQ6kFalVVelX2QKJXU3as7uUlw0At66NnNIoOafZSyQuQZSUa46Ouy3DW6Y3AxogCBHrW1WgH74uMI7sVIMWIKK88jOwIbXuybWpcktZMC%2FGElCXL9y1PSShH3dT3yeW%2BiOxHLmYnUaODwd1TySdxerg%2F%2BLEpfa%2BMObpVX4P9gQfgmO74z6GzXIpvrSOb4sICESPzjrtwsbn38LOfNvmHkZXULCDeD76dMJDS%2F96KqPRciFT908Zta1jqnjxt8SiKCW9PkYEIwPFOmUpnu41Ji7eMAfZ4R7yHMCxKlmObyvqL45OjLGnwU3CFPJ8U2WqfVx2nt8Gqxj2ISG5ywwkYCUNAJCAhn23MpOi6UOMZhM4zvTIjjPCvULWmnNz5gJDakoDeHxphbfqC7C4LlbHQIL9usznb83kjc9zFiQTXZMfuDuYqMfUoWOKvSKvXtZ8nRKQ8Z%2BkJrNmiDXUkpdhrF2u%2FqHYcclqrnB8IssUQ%7ChT3OG6TINp8%3D%3AV5sX9ClkBZNqo%2BzCXyQ%2B8NZq%2BXJDnZdiR1bQsca4spM%3D"
                    },
                    {
                        "domain": "www.viator.com",
                        "hostOnly": True,
                        "httpOnly": False,
                        "name": "REFERER_PAGE_REQUEST_ID",
                        "path": "/",
                        "sameSite": "unspecified",
                        "secure": False,
                        "session": True,
                        "storeId": "0",
                        "value": "689C5C33:516F_0A280B70:01BB_67026E94_FC100EC:3D13D5"
                    },
                    {
                        "domain": ".viator.com",
                        "expirationDate": 1759748630,
                        "hostOnly": False,
                        "httpOnly": False,
                        "name": "OptanonConsent",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": False,
                        "session": False,
                        "storeId": "0",
                        "value": "isGpcEnabled=0&datestamp=Sun+Oct+06+2024+13%3A03%3A50+GMT%2B0200+(Central+European+Summer+Time)&version=202402.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=47c34118-c6de-4a1b-94cc-89750786ff54&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0004%3A1%2CC0002%3A1&AwaitingReconsent=false"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1762772633.025073,
                        "hostOnly": True,
                        "httpOnly": True,
                        "name": "ORION_SESSION_REQ",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "689C5C45%3A4B00_0A280FEB%3A01BB_67026E96_1202F41%3A1F527B%7C689C5C33%3A516F_0A280B70%3A01BB_67026E94_FC100EC%3A3D13D5%7C689C5C33%3A516F_0A280B70%3A01BB_67026E94_FC100EC%3A3D13D5"
                    },
                    {
                        "domain": "www.viator.com",
                        "expirationDate": 1728817433.025125,
                        "hostOnly": True,
                        "httpOnly": True,
                        "name": "profilingSession",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "i0U8KHXJB2vhN8Uu5z94Qw%253D%253D%257CnvE0lhUG9iw0KEVEVkjXnZa%252FayLAN9eforbyZRcZC5n2tiuTcHaIwFJrUFHSQFc29OWO3wvDfAChT%252F8VgRC2zW%252FEdKutQtH9HsWQ1M%252FzSmJ%252BlQ%253D%253D%257CCCbYMQ16d2U%253D%253AQYiyKnA2emy8K%252BYBi5G4kLxxPA%252BwbgiaYTZOpMnrRNA%253D"
                    },
                    {
                        "domain": ".viator.com",
                        "expirationDate": 1759748633.025172,
                        "hostOnly": False,
                        "httpOnly": False,
                        "name": "datadome",
                        "path": "/",
                        "sameSite": "lax",
                        "secure": True,
                        "session": False,
                        "storeId": "0",
                        "value": "PEGdthcTW34w5wBPlxwIvTUN0L9~zx6p8fX6LtDY3CYcGfjER05GxVyJ93J6TPRSQpCgIS6UytTXXqtJId8Ewqk8Cad5xYcoMdNupPbhsh_3QXwb7pimsgmTwsmGghnS"
                    }
                ]))
                page = await browser.new_page()
                artifacts = []
                await page.goto(configuration['url'])
                await page.wait_for_selector(configuration['wait_for_selector'], state='attached', timeout=10000)

                platform = find_or_create_node(Platform, {"name": self.platform_name})
                scrapper = find_or_create_node(Scrapper, {"name": self.adapter_name})
                url_node = create_url_node(configuration['url'])
                url_node.access_time = datetime.now()
                url_node.found_at.connect(platform)
                url_node.scrapped_by.connect(scrapper)

                url_node.save()

                artifacts.extend([platform, scrapper, url_node])

                for selector in configuration['selectors']:
                    product_nodes = await page.query_selector_all(selector['selector'])

                    for node in product_nodes:
                        if selector['extract_from'] == "attribute":
                            value = await node.get_attribute(selector['attribute_name'])
                        elif selector['extract_from'] == "text":
                            value = await node.inner_text()
                        elif selector['extract_from'] == "html":
                            value = await node.inner_html()

                        if selector['artifact_type'] == 'Url':
                            value = construct_absolute_url(value, configuration['url'])
                            neo_node = create_url_node(value)
                            neo_node.found_at.connect(platform)
                            neo_node.scrapped_by.connect(scrapper)
                        else:
                            neo_node = find_or_create_node(Artifact, {
                                "artifact_type": selector['artifact_type'],
                                "artifact_property": selector['artifact_attribute'],
                                "artifact_value": value,
                                "metadata": selector
                            })
                            neo_node.containing_url.connect(url_node)

                        artifacts.extend([neo_node])

                        if selector.get('task_adapter') and selector.get('task_configuration'):
                            new_task_configuration = json.loads(
                                json.dumps(selector['task_configuration'])
                            )

                            new_task_configuration['url'] = new_task_configuration['url'].replace(
                                "{{value}}",
                                construct_absolute_url(
                                    value,
                                    configuration['url']
                                )
                            )

                            self.publish_to_kafka(self.kafka_config.get("topik"), "schedule_task", {
                                "task_id": task_id,
                                "adapter_type": selector["task_adapter"],
                                "configuration": new_task_configuration
                            })

                self.publish_to_kafka(self.kafka_config.get("topik"), "update_task", {
                    "task_id": task_id,
                    "status": "COMPLETED",
                    "executed_at": datetime.now().isoformat(),
                    "artifacts": [artifact.element_id for artifact in artifacts]
                })

                await browser.close()
        except Exception as e:
            print(f"Failed to scrape {configuration['url']}: {e}")
            self.publish_to_kafka(self.kafka_config.get("topik"), "update_task", {
                "task_id": task_id,
                "status": "FAILED",
                "executed_at": datetime.now().isoformat(),
                "error": exception_to_json(e)
            })

    def publish_to_kafka(self, topic, key, value):
        try:
            self.kafka_producer.produce(topic, key=key, value=json.dumps(value).encode('utf-8'))
            self.kafka_producer.flush()
            print(f"Message published to topic {topic}: {key} -> {value}")
        except Exception as e:
            print(f"Failed to publish message: {e}")

    def close(self):
        pass
