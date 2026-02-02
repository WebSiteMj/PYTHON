from Classes.satellite import Satellite

class Constellation:
    def __init__(self, name):
        self.name = name
        self.satellites = []

    def add_satellite(self, satellite):
        self.satellites.append(satellite)

    def build_leo_constellation(
        self,
        planes,
        sats_per_plane,
        altitude_km,
        inclination_deg
    ):
        sat_id = 1

        for plane in range(planes):
            raan = plane * (360 / planes)

            for sat in range(sats_per_plane):
                true_anomaly = sat * (360 / sats_per_plane)

                satellite = Satellite(
                    name=f"SAT-{sat_id}",
                    altitude_km=altitude_km,
                    inclination_deg=inclination_deg,
                    raan_deg=raan,
                    true_anomaly_deg=true_anomaly
                )

                self.add_satellite(satellite)
                sat_id += 1

    def show(self):
        print(f"Constellation: {self.name}")
        for sat in self.satellites:
            print(sat)
