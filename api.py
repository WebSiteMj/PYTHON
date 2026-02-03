from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from Classes.constellation import Constellation


class ConstellationRequest(BaseModel):
    name: str = "LEO-Net"
    planes: int
    sats_per_plane: int
    altitude_km: float
    inclination_deg: float


class SatelliteResponse(BaseModel):
    name: str
    altitude_km: float
    inclination_deg: float
    raan_deg: float
    true_anomaly_deg: float
    x: float
    y: float


class ConstellationResponse(BaseModel):
    name: str
    satellites: List[SatelliteResponse]


app = FastAPI(title="Constellation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/constellation", response_model=ConstellationResponse)
def build_constellation(request: ConstellationRequest) -> ConstellationResponse:
    constellation = Constellation(request.name)

    constellation.build_leo_constellation(
        planes=request.planes,
        sats_per_plane=request.sats_per_plane,
        altitude_km=request.altitude_km,
        inclination_deg=request.inclination_deg,
    )

    satellites: List[SatelliteResponse] = []
    for sat in constellation.satellites:
        x, y = sat.position_2d()
        satellites.append(
            SatelliteResponse(
                name=sat.name,
                altitude_km=sat.altitude_km,
                inclination_deg=sat.inclination_deg,
                raan_deg=sat.raan_deg,
                true_anomaly_deg=sat.true_anomaly_deg,
                x=x,
                y=y,
            )
        )

    return ConstellationResponse(
        name=constellation.name,
        satellites=satellites,
    )


@app.get("/health")
def health():
    return {"status": "ok"}

