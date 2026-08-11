/// <reference types="jasmine" />

import 'zone.js';
import 'zone.js/testing';

import { getTestBed, TestBed, TestModuleMetadata } from '@angular/core/testing';

import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

import { testProviders } from 'shared';

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
  {
    teardown: {
      destroyAfterEach: true,
    },
  },
);

const originalConfigureTestingModule =
  TestBed.configureTestingModule.bind(TestBed);

TestBed.configureTestingModule = (moduleDef: TestModuleMetadata) => {
  moduleDef.providers ??= [];

  moduleDef.providers.push(...testProviders);

  return originalConfigureTestingModule(moduleDef);
};
