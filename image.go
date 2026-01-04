package main

import (
	"github.com/moby/moby/api/types/image"
	"github.com/moby/moby/client"
)

func (a *App) ImageList() (*client.ImagesDiskUsage, error) {
	usages, err := a.cli.DiskUsage(a.ctx, client.DiskUsageOptions{
		Images:  true,
		Verbose: true,
	})
	if err != nil {
		return nil, err
	}

	a.log.Debug("got images disk", "usages", usages.Images)

	return &usages.Images, nil
}

func (a *App) ImageOne(id string) (*image.InspectResponse, error) {
	r, err := a.cli.ImageInspect(a.ctx, id)
	if err != nil {
		return nil, err
	}

	return &r.InspectResponse, nil
}

func (a *App) ImageFiles(id string) (err error) {

	return err
}
