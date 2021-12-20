import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { Button, Icon } from 'rsuite';
import { PoolData } from '../../model/PoolData';
import { ParentSize } from '@visx/responsive';
import AreaChart from '../AreaChart/AreaChart';
import { TabMenu } from '../TabMenu/TabMenu';
import { POOL_DETAIL_TABS } from '../../enum/POOL_DETAIL_TABS';
import lbtcImage from '../../images/liquid_btc.png';
import usdtImage from '../../images/usdt.png';
import './PoolDetail.scss';

type Props = {
  back: () => void;
  poolData: PoolData;
};

export const PoolDetail: React.FC<Props> = ({ back }) => {
  const [selectedTab, setSelectedTab] = useState<POOL_DETAIL_TABS>(
    POOL_DETAIL_TABS.PRICE,
  );

  const history = useHistory();

  return (
    <div className="pool-detail-container">
      <div className="pool-detail-main">
        <div className="pool-detail-header">
          <div className="pool-detail-header-left">
            <Button className="pool-detail-button" onClick={back}>
              <Icon
                className="pool-detail-back-icon"
                icon="angle-left"
                size="4x"
              />
              <div className="pool-detail-page-text">L-BTC/USDT</div>
            </Button>
          </div>
          <div className="pool-detail-header-right">
            <TabMenu
              menuItems={[
                POOL_DETAIL_TABS.PRICE,
                POOL_DETAIL_TABS.VOLUME,
                POOL_DETAIL_TABS.LIQUIDITY,
                POOL_DETAIL_TABS.FEES,
              ]}
              selectedItem={selectedTab}
              onClick={(eventKey: any) => setSelectedTab(eventKey)}
            />
          </div>
        </div>
        <div className="pool-detail-content">
          <div className="pool-detail-content-right desktop-hidden">
            <ParentSize>
              {({ width, height }) => (
                <AreaChart width={width} height={height} />
              )}
            </ParentSize>
          </div>
          <div className="pool-detail-content-left">
            <div className="pool-detail-content-left-header">Pool Pairs</div>
            <div className="pool-detail-amount">
              <div className="pool-detail-item">
                <div className="pool-detail-img-content left-side">
                  <img className="pool-detail-img" src={lbtcImage} alt="" />
                  <span>L-BTC</span>
                </div>
                82.54m
              </div>

              <div className="pool-detail-item">
                <div className="pool-detail-img-content left-side">
                  <img className="pool-detail-img" src={usdtImage} alt="" />
                  <span>USDT</span>
                </div>
                123.41k
              </div>
            </div>

            <div className="pool-detail-volume-fee">
              <div className="pool-detail-item">
                <div className="left-side">Price</div>
                <div>Volume 24h</div>
              </div>
              <div className="pool-detail-item">
                <div className="pool-detail-table-text left-side">%12</div>
                <div className="pool-detail-table-text">%219.20m</div>
              </div>
              <div className="pool-detail-item-detail">
                <div className="left-side">
                  <Icon
                    className="pool-detail-arrow-down-icon"
                    icon="arrow-down2"
                  />
                  <span className="pool-detail-table-arrow-down-text">
                    1.35%
                  </span>
                </div>
                <div>
                  <Icon
                    className="pool-detail-arrow-up-icon"
                    icon="arrow-up2"
                  />
                  <span className="pool-detail-table-arrow-up-text">
                    74.54%
                  </span>
                </div>
              </div>
            </div>

            <div className="pool-detail-volume-fee">
              <div className="pool-detail-item">
                <div className="left-side">TVL</div>
                <div>Fees 24h</div>
              </div>
              <div className="pool-detail-item">
                <div className="pool-detail-table-text left-side">$357.77m</div>
                <div className="pool-detail-table-text">%657.61k</div>
              </div>
              <div className="pool-detail-item-detail">
                <div className="left-side">
                  <Icon
                    className="pool-detail-arrow-down-icon"
                    icon="arrow-down2"
                  />
                  <span className="pool-detail-table-arrow-down-text">
                    1.35%
                  </span>
                </div>
                <div>
                  <Icon
                    className="pool-detail-arrow-up-icon"
                    icon="arrow-up2"
                  />
                  <span className="pool-detail-table-arrow-up-text">
                    74.54%
                  </span>
                </div>
              </div>
            </div>

            <Button
              appearance="default"
              className="primary-button pool-detail-add-button"
              onClick={() => {
                history.push(ROUTE_PATH.LIQUIDITY);
              }}
            >
              Add Liquidity
            </Button>
          </div>
          <div className="pool-detail-content-right mobile-hidden">
            <ParentSize>
              {({ width, height }) => (
                <AreaChart width={width} height={height} />
              )}
            </ParentSize>
          </div>
        </div>
      </div>
    </div>
  );
};
