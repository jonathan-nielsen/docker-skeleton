#!/bin/bash

# Trace logs (last 1000 rows) of the container "app"
docker logs -f --tail 1000 app