from pydantic import AmqpDsn, PostgresDsn
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "учебный портал"

    SERVICE_PG_HOST: str
    SERVICE_PG_PORT: int
    SERVICE_PG_USER: str
    SERVICE_PG_PASSWORD: str
    SERVICE_PG_DB: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALGORITHM: str
    JWT_SECRET_KEY: str
    JWT_REFRESH_SECRET_KEY: str

    MINIO_URL: str
    MINIO_ACCESS: str
    MINIO_SECRET: str
    MINIO_BUCKET: str


    URL_ML: str

    class Config:
        case_sensitive = True
        env_file = ".env_example"

    @property
    def pg_conn(self) -> str:
        postgres_dsn = PostgresDsn(
            f"postgresql+asyncpg://{self.SERVICE_PG_USER}:{self.SERVICE_PG_PASSWORD}@{self.SERVICE_PG_HOST}:{self.SERVICE_PG_PORT}/{self.SERVICE_PG_DB}"
        )
        return postgres_dsn.__str__()

    @property
    def features(self) -> dict:
        return {
        "AUS": "Асимметрия углового шва",
        "MSP": "Брызги металла",
        "TINC": "Вольфрамовое включение",
        "INC": "Включение",
        "SINC": "Включение одиночное",
        "CRS": "Вогнутость корня шва",
        "EPRS": "Выпуклость (превышение проплавления) корня шва",
        "DRL": "Глубокий валик",
        "CCR": "Кратерная трещина. Трещина в кратере",
        "SCC": "Кратер. Усадочная раковина сварного шва",
        "LPOR": "Линия пор. Линейная пористость",
        "MIW": "Максимальная ширина включения",
        "MSW": "Максимальный размер включения",
        "LEP": "Местное превышение проплава",
        "NMB": "Неплавящийся наплыв",
        "BD": "Наплыв",
        "IWP": "Неправильный профиль сварного шва",
        "LOF": "Непровар. Неполный провар",
        "DCN": "Несплошность",
        "OIN": "Окисное включение",
        "DTC": "Отслоение",
        "PSR": "Плохое возобновление шва",
        "UCT": "Подрез",
        "POR": "Поры",
        "EOC": "Превышение выпуклости",
        "EWR": "Превышение усиления сварного шва",
        "DTL": "Прерывистая линия",
        "LCWJ": "Продольная трещина сварного соединения",
        "PWS": "Прохождение сварного шва",
        "RDC": "Радиационная трещина",
        "BCWJ": "Разветвленная трещина сварного соединения",
        "COI": "Скопление включений",
        "FIW": "Свищ в сварном шве",
        "TSC": "Трещина поперечная",
        "CWJ": "Трещина сварного соединения. Трещина",
        "RBWB": "Углубление (западание) между валиками шва",
        "SCAV": "Усадочные раковины",
        "FLIN": "Флюсовое включение",
        "SIIW": "Шлаковое включение сварного шва",
        "USS": "Неровная поверхность шва",
        "USW": "Неровная ширина шва"
    }

settings = Settings()
