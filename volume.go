package main

import (
	"github.com/moby/moby/client"
)

func (a *App) VolumeList() (*client.VolumesDiskUsage, error) {
	usages, err := a.cli.DiskUsage(a.ctx, client.DiskUsageOptions{
		Volumes: true,
		Verbose: true,
	})
	if err != nil {
		return nil, err
	}

	a.log.Debug("got volumes disk", "usages", usages.Volumes)

	return &usages.Volumes, nil
}
