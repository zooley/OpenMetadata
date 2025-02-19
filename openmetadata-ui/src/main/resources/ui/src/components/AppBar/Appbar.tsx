/*
 *  Copyright 2022 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import Icon from '@ant-design/icons/lib/components/Icon';
import { Col, Row } from 'antd';
import { AxiosError } from 'axios';
import { isString } from 'lodash';
import Qs from 'qs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ReactComponent as IconAPI } from '../../assets/svg/api.svg';
import { ReactComponent as IconDoc } from '../../assets/svg/doc.svg';
import { ReactComponent as IconExternalLink } from '../../assets/svg/external-links.svg';
import { ReactComponent as IconTour } from '../../assets/svg/icon-tour.svg';
import { ReactComponent as IconSlackGrey } from '../../assets/svg/slack-grey.svg';
import { ReactComponent as IconVersionBlack } from '../../assets/svg/version-black.svg';
import { ReactComponent as IconWhatsNew } from '../../assets/svg/whats-new.svg';
import { useGlobalSearchProvider } from '../../components/GlobalSearchProvider/GlobalSearchProvider';
import { useTourProvider } from '../../components/TourProvider/TourProvider';
import {
  getExplorePath,
  ROUTES,
  TOUR_SEARCH_TERM,
} from '../../constants/constants';
import {
  urlGitbookDocs,
  urlGithubRepo,
  urlJoinSlack,
} from '../../constants/URL.constants';
import { CurrentTourPageType } from '../../enums/tour.enum';
import { getVersion } from '../../rest/miscAPI';
import {
  extractDetailsFromToken,
  isProtectedRoute,
  isTourRoute,
} from '../../utils/AuthProvider.util';
import { addToRecentSearched } from '../../utils/CommonUtils';
import searchClassBase from '../../utils/SearchClassBase';
import { showErrorToast } from '../../utils/ToastUtils';
import { useAuthContext } from '../Auth/AuthProviders/AuthProvider';
import NavBar from '../NavBar/NavBar';
import './app-bar.style.less';

const Appbar: React.FC = (): JSX.Element => {
  const tabsInfo = searchClassBase.getTabsInfo();
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const { isTourOpen, updateTourPage, updateTourSearch, tourSearchValue } =
    useTourProvider();

  const { isAuthenticated, onLogoutHandler } = useAuthContext();

  const { searchCriteria } = useGlobalSearchProvider();

  const parsedQueryString = Qs.parse(
    location.search.startsWith('?')
      ? location.search.substr(1)
      : location.search
  );

  const searchQuery = isString(parsedQueryString.search)
    ? parsedQueryString.search
    : '';

  const [searchValue, setSearchValue] = useState(searchQuery);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState<boolean>(false);
  const [version, setVersion] = useState<string>('');

  const handleFeatureModal = (value: boolean) => {
    setIsFeatureModalOpen(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (isTourOpen) {
      updateTourSearch(value);
    } else {
      value ? setIsOpen(true) : setIsOpen(false);
    }
  };

  const supportLink = [
    {
      label: (
        <Row
          className="cursor-pointer"
          onClick={() => history.push(ROUTES.TOUR)}>
          <Col span={4}>
            <Icon
              className="align-middle m-r-xss"
              component={IconTour}
              style={{ fontSize: '18px' }}
            />
          </Col>
          <Col span={20}>
            <span className="text-base-color">{t('label.tour')}</span>
          </Col>
        </Row>
      ),
      key: 'tour',
    },
    {
      label: (
        <a
          className="link-title no-underline"
          href={urlGitbookDocs}
          rel="noreferrer"
          target="_blank">
          <Row className="cursor-pointer">
            <Col span={4}>
              <Icon
                className="align-middle"
                component={IconDoc}
                name="Doc icon"
                style={{ fontSize: '18px' }}
              />
            </Col>
            <Col span={20}>
              <span className="text-base-color">{t('label.doc-plural')}</span>

              <IconExternalLink
                className="text-base-color m-l-xss"
                height={14}
                width={14}
              />
            </Col>
          </Row>
        </a>
      ),
      key: 'docs',
    },
    {
      label: (
        <Link className="link-title no-underline" to={ROUTES.SWAGGER}>
          <Row className="cursor-pointer">
            <Col span={4}>
              <Icon
                className="align-middle"
                component={IconAPI}
                name="API icon"
                style={{ fontSize: '18px' }}
              />
            </Col>
            <Col span={20}>
              <span className="text-base-color">
                {t('label.api-uppercase')}
              </span>
            </Col>
          </Row>
        </Link>
      ),
      key: 'api',
    },
    {
      label: (
        <a
          className="link-title no-underline"
          href={urlJoinSlack}
          rel="noreferrer"
          target="_blank">
          <Row className="cursor-pointer">
            <Col span={4}>
              <Icon
                className="align-middle"
                component={IconSlackGrey}
                name="slack icon"
                style={{ fontSize: '18px' }}
              />
            </Col>
            <Col span={20}>
              <span className="text-base-color">
                {t('label.slack-support')}
              </span>
              <IconExternalLink
                className="text-base-color m-l-xss"
                height={14}
                width={14}
              />
            </Col>
          </Row>
        </a>
      ),
      key: 'slack',
    },

    {
      label: (
        <Row
          className="cursor-pointer"
          onClick={() => handleFeatureModal(true)}>
          <Col span={4}>
            <Icon
              className="align-middle"
              component={IconWhatsNew}
              style={{ fontSize: '18px' }}
            />
          </Col>
          <Col span={20}>
            <span className="text-base-color">{t('label.whats-new')}</span>
          </Col>
        </Row>
      ),
      key: 'whats-new',
    },
    {
      label: (
        <a
          className="link-title no-underline"
          href={urlGithubRepo}
          rel="noreferrer"
          target="_blank">
          <Row className="cursor-pointer">
            <Col span={4}>
              <Icon
                className="align-middle"
                component={IconVersionBlack}
                name="Version icon"
                style={{ fontSize: '18px' }}
              />
            </Col>
            <Col span={20}>
              <span className="text-base-color">{`${t('label.version')} ${
                (version ? version : '?').split('-')[0]
              }`}</span>

              <IconExternalLink
                className="text-base-color m-l-xss"
                height={14}
                width={14}
              />
            </Col>
          </Row>
        </a>
      ),
      key: 'versions',
    },
  ];

  const searchHandler = (value: string) => {
    if (!isTourOpen) {
      setIsOpen(false);
      addToRecentSearched(value);

      const defaultTab: string =
        searchCriteria !== '' ? tabsInfo[searchCriteria].path : '';

      history.push(
        getExplorePath({
          tab: defaultTab,
          search: value,
          isPersistFilters: false,
          extraParameters: {
            sort: '_score',
          },
        })
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
      if (isTourOpen && searchValue === TOUR_SEARCH_TERM) {
        updateTourPage(CurrentTourPageType.EXPLORE_PAGE);
        updateTourSearch('');
      }

      searchHandler(target.value);
    }
  };

  const handleOnclick = () => {
    searchHandler(searchValue);
  };

  const handleClear = () => {
    setSearchValue('');
    searchHandler('');
  };

  const fetchOMVersion = () => {
    getVersion()
      .then((res) => {
        setVersion(res.version);
      })
      .catch((err: AxiosError) => {
        showErrorToast(
          err,
          t('server.entity-fetch-error', {
            entity: t('label.version'),
          })
        );
      });
  };

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);
  useEffect(() => {
    if (isTourOpen) {
      setSearchValue(tourSearchValue);
    }
  }, [tourSearchValue, isTourOpen]);

  useEffect(() => {
    fetchOMVersion();
  }, []);

  useEffect(() => {
    const handleDocumentVisibilityChange = () => {
      if (
        isProtectedRoute(location.pathname) &&
        isTourRoute(location.pathname)
      ) {
        return;
      }
      const { isExpired, exp } = extractDetailsFromToken();
      if (!document.hidden && isExpired) {
        exp && toast.info(t('message.session-expired'));
        onLogoutHandler();
      }
    };

    addEventListener('focus', handleDocumentVisibilityChange);

    return () => {
      removeEventListener('focus', handleDocumentVisibilityChange);
    };
  }, []);

  return (
    <>
      {isProtectedRoute(location.pathname) && isAuthenticated ? (
        <NavBar
          handleClear={handleClear}
          handleFeatureModal={handleFeatureModal}
          handleKeyDown={handleKeyDown}
          handleOnClick={handleOnclick}
          handleSearchBoxOpen={setIsOpen}
          handleSearchChange={handleSearchChange}
          isFeatureModalOpen={isFeatureModalOpen}
          isSearchBoxOpen={isOpen}
          pathname={location.pathname}
          searchValue={searchValue || ''}
          supportDropdown={supportLink}
        />
      ) : null}
    </>
  );
};

export default Appbar;
