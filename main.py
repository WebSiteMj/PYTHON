from Classes.constellation import Constellation


if __name__ == "__main__":
    leo_constellation = Constellation("LEO-Net")

    leo_constellation.build_leo_constellation(
        planes=6,
        sats_per_plane=8,
        altitude_km=550,
        inclination_deg=53
    )

    leo_constellation.show()

