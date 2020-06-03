#!/bin/bash

sudo docker ps -q | xargs -n 1 docker inspect --format '{{ .Name }} {{range .NetworkSettings.Networks}} {{.IPAddress}}{{end}}' | sed 's#^/##';


# table {{.ID}}\t{{.Names}}\t{{.Ports}}