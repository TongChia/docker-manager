package main

import (
	"github.com/moby/moby/api/types/network"
	"github.com/moby/moby/client"
)

func (a *App) NetworkList() ([]network.Summary, error) {
	r, err := a.cli.NetworkList(a.ctx, client.NetworkListOptions{
		Filters: make(client.Filters).Add("driver", "bridge"),
	})
	if err != nil {
		return nil, err
	}

	a.log.Debug("got network list", "network", r.Items)

	return r.Items, nil
}
