import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneFieldType
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
import { ColorPicker, IColor, Label } from '@fluentui/react';

import PersonalGreeting from './components/PersonalGreeting';
import { BothOrder, IPersonalGreetingProps, NameMode, SourceFormat } from './components/IPersonalGreetingProps';

export interface IPersonalGreetingWebPartProps {
  greetingText: string;
  context: WebPartContext;
  position: string;
  textColor: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  nameMode: NameMode;
  sourceFormat: SourceFormat;
  bothOrder: BothOrder;
}

export default class PersonalGreetingWebPart extends BaseClientSideWebPart <IPersonalGreetingWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPersonalGreetingProps> = React.createElement(
      PersonalGreeting,
      {
        greetingText: this.properties.greetingText,
        context: this.context,
        position: this.properties.position,
        textColor: this.properties.textColor,
        fontSize: this.properties.fontSize,
        bold: this.properties.bold,
        italic: this.properties.italic,
        underline: this.properties.underline,
        nameMode: this.properties.nameMode || 'first',
        sourceFormat: this.properties.sourceFormat || 'auto',
        bothOrder: this.properties.bothOrder || 'firstLast'
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Use the fields below to configure the webpart. The placeholder will be removed once text has been entered into the "Greeting Text" field.'

          },
          groups: [
            {
              groupName: 'Text',
              groupFields: [
                PropertyPaneTextField('greetingText', {
                  label: 'Greeting Text',
                  description: 'e.g. "Welcome,"'
                }),
                PropertyPaneSlider('fontSize', {
                  label: 'Font Size (px)',
                  min: 10,
                  max: 96,
                  step: 1,
                  showValue: true,
                  value: this.properties.fontSize || 28
                }),
                PropertyPaneDropdown('position', {
                  label: 'Text Position',
                  selectedKey: this.properties.position || 'left',
                  options: [
                    { key: 'left', text: 'Left' },
                    { key: 'center', text: 'Center' },
                    { key: 'right', text: 'Right' }
                  ]
                }),
                PropertyPaneToggle('bold', { label: 'Bold' }),
                PropertyPaneToggle('italic', { label: 'Italic' }),
                PropertyPaneToggle('underline', { label: 'Underline' }),
                {
                  type: PropertyPaneFieldType.Custom,
                  targetProperty: 'textColor',
                  properties: {
                    key: 'textColor',
                    onRender: this._renderColorPicker,
                    onDispose: this._disposeColorPicker,
                    isInternal: false
                  }
                }
              ]
            },
            {
              groupName: 'Name',
              groupFields: [
                PropertyPaneDropdown('nameMode', {
                  label: 'Show',
                  selectedKey: this.properties.nameMode || 'first',
                  options: [
                    { key: 'first', text: 'First name' },
                    { key: 'last', text: 'Last name' },
                    { key: 'both', text: 'First and last name' }
                  ]
                }),
                PropertyPaneDropdown('sourceFormat', {
                  label: 'Display name structure in your directory',
                  selectedKey: this.properties.sourceFormat || 'auto',
                  options: [
                    { key: 'auto', text: 'Auto-detect (comma = "Last, First")' },
                    { key: 'firstLast', text: 'First Last (e.g. Matt Both)' },
                    { key: 'lastFirst', text: 'Last, First (e.g. Both, Matt)' }
                  ]
                }),
                PropertyPaneDropdown('bothOrder', {
                  label: 'Order when showing both',
                  selectedKey: this.properties.bothOrder || 'firstLast',
                  disabled: this.properties.nameMode !== 'both',
                  options: [
                    { key: 'firstLast', text: 'First Last' },
                    { key: 'lastFirst', text: 'Last, First' }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
  private _renderColorPicker = (
    domElement: HTMLElement,
    _context?: unknown,
    changeCallback?: (targetProperty?: string, newValue?: unknown, isValidEntry?: boolean) => void
  ): void => {
    const colorPicker: React.ReactElement = React.createElement(
      React.Fragment,
      undefined,
      React.createElement(Label, undefined, 'Text Color'),
      React.createElement(ColorPicker, {
        alphaType: 'none',
        color: this.properties.textColor || '#000000',
        onChange: (_event: React.SyntheticEvent<HTMLElement>, color: IColor): void => {
          changeCallback?.('textColor', `#${color.hex}`);
        }
      })
    );

    ReactDom.render(colorPicker, domElement);
  }

  private _disposeColorPicker = (domElement: HTMLElement): void => {
    ReactDom.unmountComponentAtNode(domElement);
  }
}
