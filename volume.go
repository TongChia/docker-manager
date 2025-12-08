package main

import (
	"github.com/moby/moby/api/types/volume"
	"github.com/moby/moby/client"
)

type Volume = volume.Volume

func (a *App) VolumeList() ([]Volume, error) {
	volumes, err := a.cli.VolumeList(a.ctx, client.VolumeListOptions{})
	if err != nil {
		a.log.Error("Failed to list volumes: " + err.Error())
		return nil, err
	}

	return volumes.Items, nil
}
