/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { POOL_MANAGEMENT_TABS } from '../../enum/POOL_MANAGEMENT_TABS';
import { Button, Icon, IconButton } from 'rsuite';
import { TabMenu } from '../TabMenu/TabMenu';
import Backdrop from '../Backdrop/Backdrop';
import { Pool } from '@bitmatrix/models';
import { PoolCard } from '../PoolCard/PoolCard';
import './PoolManagement.scss';

type Props = {
  pools: Pool[];
  onClick: (index: number) => void;
};

export const PoolManagement: React.FC<Props> = ({ pools, onClick }) => {
  const [selectedTab, setSelectedTab] = useState<POOL_MANAGEMENT_TABS>(POOL_MANAGEMENT_TABS.TOP_POOLS);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const history = useHistory();

  const getPoolData = () => {
    if (selectedTab == POOL_MANAGEMENT_TABS.TOP_POOLS) {
      return pools.map((pool, index) => {
        return (
          <div key={pool.id} className="pool-page-card card-1">
            <PoolCard pool={pool} rank={index + 1} onClick={() => onClick(index)} />
          </div>
        );
      });
    } else if (selectedTab == POOL_MANAGEMENT_TABS.MY_POOLS) {
      return (
        <div key={1} className="pool-page-card card-2">
          <div className="no-pool-text">No pool found.</div>
          {/* <PoolCard
            pool={pools[0]}
            rank={1}
            onClick={() => onClick(pools[0])}
          /> */}
        </div>
      );
    }
  };

  const addButtons = (): JSX.Element => {
    return (
      <>
        <Backdrop show={showButtons} clicked={() => setShowButtons(false)} />
        <div className="add-buttons-content">
          <div className="six">
            <Button
              appearance="default"
              className="pm-add-button pm-add-liquidity"
              onClick={() => {
                history.push(ROUTE_PATH.ADD_LIQUIDTY);
              }}
            >
              Add Liquidity
            </Button>
            <Button
              appearance="default"
              className="pm-add-button pm-create-new-pool"
              onClick={() => console.log('create new pool')}
            >
              Create New Pool
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="pool-page-main">
      <div className="pool-page-header">
        <IconButton className="pool-page-button" icon={<Icon className="pool-page-icon" icon="sliders" size="4x" />} />

        <TabMenu
          menuItems={[POOL_MANAGEMENT_TABS.TOP_POOLS, POOL_MANAGEMENT_TABS.MY_POOLS]}
          selectedItem={selectedTab}
          onClick={(eventKey: any) => setSelectedTab(eventKey)}
        />
        <IconButton
          className="pool-page-button"
          onClick={() => setShowButtons(!showButtons)}
          icon={<Icon className="pool-page-icon" icon="plus" size="4x" />}
        />
        {showButtons && addButtons()}
      </div>
      <div className="pool-page-content">
        <div className={`${selectedTab == POOL_MANAGEMENT_TABS.TOP_POOLS ? 'tab-1' : 'tab-2'}`}>{getPoolData()}</div>
      </div>
    </div>
  );
};
