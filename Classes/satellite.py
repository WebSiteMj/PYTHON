import math

class Satellite:
    def __init__(self, name, altitude_km, inclination_deg, raan_deg, true_anomaly_deg):
        self.name = name
        self.altitude_km = altitude_km
        self.inclination_deg = inclination_deg
        self.raan_deg = raan_deg
        self.true_anomaly_deg = true_anomaly_deg

    def position_2d(self):
        """
        Simple 2D circular orbit projection (for visualization)
        """
        earth_radius_km = 6371
        r = earth_radius_km + self.altitude_km

        theta = math.radians(self.true_anomaly_deg)
        x = r * math.cos(theta)
        y = r * math.sin(theta)

        return x, y

    def __str__(self):
        return (f"{self.name}: Alt={self.altitude_km}km, "
                f"Incl={self.inclination_deg}°, "
                f"RAAN={self.raan_deg}°, "
                f"TA={self.true_anomaly_deg}°")
