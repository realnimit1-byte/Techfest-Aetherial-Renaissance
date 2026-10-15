#include <math.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

#define DEFAULT_COUNT 1800
#define MAX_COUNT 6000

static uint32_t random_state = 0xA37E2026u;

static uint32_t next_random(void) {
  random_state = random_state * 1664525u + 1013904223u;
  return random_state;
}

static double unit_random(void) {
  return (double)(next_random() >> 8) / 16777216.0;
}

int main(int argc, char **argv) {
  int count = DEFAULT_COUNT;
  if (argc > 1) {
    char *end = NULL;
    long requested = strtol(argv[1], &end, 10);
    if (end == argv[1] || *end != '\0' || requested < 1 || requested > MAX_COUNT) {
      fprintf(stderr, "Particle count must be between 1 and %d.\n", MAX_COUNT);
      return 2;
    }
    count = (int)requested;
  }

  const double tau = 6.28318530717958647692;
  puts("{\"particles\":[");

  for (int i = 0; i < count; ++i) {
    const double azimuth = unit_random() * tau;
    const double vertical = unit_random() * 2.0 - 1.0;
    const double ring_bias = unit_random();
    const double radius = 8.0 + 19.0 * sqrt(ring_bias);
    const double planar = sqrt(1.0 - vertical * vertical);
    const double x = cos(azimuth) * planar * radius;
    const double y = vertical * radius * 0.74;
    const double z = sin(azimuth) * planar * radius;
    const double phase = unit_random() * tau;
    const double size = 0.35 + unit_random() * 1.1;

    printf(
        "[%.5f,%.5f,%.5f,%.5f,%.5f]%s\n",
        x, y, z, phase, size,
        i + 1 == count ? "" : ","
    );
  }

  puts("]}");
  return 0;
}
